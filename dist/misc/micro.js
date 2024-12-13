"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// const recorder = require('node-record-lpcm16')
// const fs = require('fs')
const recorder = __importStar(require("node-record-lpcm16"));
const fft_js_1 = require("fft-js");
// import * as fs from 'fs';
// const file = fs.createWriteStream('output.wav', { encoding: 'binary' });
const resolution = 300;
const cap = 75;
const width = 150;
const opts = {
    sampleRate: 44100,
    channels: 1,
    recorder: 'arecord',
    device: 'hw:1,0',
};
const recording = recorder.record(opts);
// Append the bar chart to the screen
console.log('Recording started');
const CLEAR_SCREEN = '\x1b[2J\x1b[H';
const RESET_COLOR = '\x1b[0m';
const COLORS = ['\x1b[41m', '\x1b[42m', '\x1b[43m', '\x1b[44m', '\x1b[45m', '\x1b[46m']; // Background colors
function resizeToPowerOfTwo(arr) {
    const length = arr.length;
    const powerOfTwo = Math.pow(2, Math.floor(Math.log2(length))); // Nearest lower power of two
    return arr.slice(0, powerOfTwo);
}
function drawVuMeter(bins) {
    console.log(CLEAR_SCREEN); // Clear the screen
    bins.forEach((bin, index) => {
        const magnitude = Math.min(Math.max(bin.mag, 0), 1); // Clamp magnitude between 0 and 1
        const barLength = Math.floor(magnitude * width); // Scale magnitude to 20 rows
        const color = COLORS[index % COLORS.length]; // Cycle through colors
        // Draw the bar
        console.log(`${color}${' '.repeat(barLength)}${RESET_COLOR} ${bin.f.toFixed(1)} Hz`);
    });
}
// real time log datastream
recording.stream().on('data', (data) => {
    try {
        // Decode 16-bit PCM to Float32
        const dataArr = new Float32Array(data.length / 2); // Divide by 2 for 16-bit PCM
        for (let i = 0; i < data.length; i += 2) {
            const value = data.readInt16LE(i); // Read 16-bit signed integer
            dataArr[i / 2] = value / 32768; // Normalize to range [-1, 1]
        }
        // Resize to nearest lower power of two
        const resizedData = resizeToPowerOfTwo(dataArr);
        // Perform FFT
        const phasors = (0, fft_js_1.fft)(resizedData);
        const frequencies = fft_js_1.util.fftFreq(phasors, opts.sampleRate);
        const magnitudes = fft_js_1.util.fftMag(phasors);
        const both = frequencies.map((f, ix) => ({
            frequency: f,
            magnitude: magnitudes[ix],
        }));
        // console.log(both);
        // map results into n frequency bins, each bin should an object with an average frequency and a average magnitude
        const n = resolution;
        const binSize = frequencies.length / n;
        const bins = [];
        for (let i = 0; i < n; i++) {
            const start = Math.floor(i * binSize);
            const end = Math.floor((i + 1) * binSize);
            const bin = both.slice(start, end);
            const avgFrequency = bin.reduce((acc, val) => acc + val.frequency, 0) / bin.length;
            const avgMagnitude = bin.reduce((acc, val) => acc + val.magnitude, 0) / bin.length;
            bins.push({ f: avgFrequency, mag: avgMagnitude });
        }
        drawVuMeter(bins.slice(0, cap)); // Update the visualization
    }
    catch (error) {
        console.error('Error processing audio data:', error);
    }
});
recording.stream().on('error', (err) => {
    console.error('recorder threw an error:', err);
});
// on crl+c stop
process.on('SIGINT', () => {
    console.log('Recording stopped');
    recording.stop();
});
