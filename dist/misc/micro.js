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
const opts = {
    sampleRate: 44100,
    channels: 1,
    recorder: 'arecord',
    device: 'hw:1,0',
};
const recording = recorder.record(opts);
console.log('Recording started');
// recording.stream().pipe(file);
// real time log datastream
recording.stream().on('data', (data) => {
    // fft each data
    // console.log(data.length, data);
    if (data.length > 11000) {
        // const dataArr = Array.from(data);
        const dataArr = [1, 0, 1, 0];
        console.log(dataArr.length, dataArr);
        const phasors = (0, fft_js_1.fft)(dataArr);
        console.log(phasors);
        const frequencies = fft_js_1.util.fftFreq(phasors, opts.sampleRate);
        const magnitudes = fft_js_1.util.fftMag(phasors);
        const both = frequencies.map((f, ix) => {
            return { frequency: f, magnitude: magnitudes[ix] };
        });
        console.log(both);
    }
});
recording.stream().on('error', (err) => {
    console.error('recorder threw an error:', err);
});
// Pause recording after one second
// setTimeout(() => {
//   recording.pause();
// }, 1000);
// // Resume another second later
// setTimeout(() => {
//   recording.resume();
// }, 2000);
// Stop recording after three seconds
setTimeout(() => {
    console.log('Recording stopped');
    recording.stop();
}, 10000);
