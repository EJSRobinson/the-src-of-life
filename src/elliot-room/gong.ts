// const recorder = require('node-record-lpcm16')
// const fs = require('fs')
import * as recorder from 'node-record-lpcm16';
import { fft, util } from 'fft-js';
// import * as fs from 'fs';

import * as ws281x from 'rpi-ws281x';

const ledLength = 194;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: 255,
});

// this funtion render different colour flashes at random locations, the probability of each colour is determined by vars a, b, c, d which takes values 0 - 1
const renderSparks = (a: number, b: number, c: number, d: number) => {
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
    const rand = Math.random();
    if (rand < a) {
      colorArray[i] = 0xff0000;
    } else if (rand < b) {
      colorArray[i] = 0x00ff00;
    } else if (rand < c) {
      colorArray[i] = 0x0000ff;
    } else if (rand < d) {
      colorArray[i] = 0xff00ff;
    }
  }
  ws281x.render(colorArray);
};

const resolution = 2048;
// const cap = 75;
// const width = 150;

const opts = {
  sampleRate: 44100,
  channels: 1,
  recorder: 'arecord',
  device: 'hw:1,0',
  bufferSize: 2048,
};

const recording = recorder.record(opts);

// Append the bar chart to the screen

console.log('Recording started');

// const CLEAR_SCREEN = '\x1b[2J\x1b[H';
// const RESET_COLOR = '\x1b[0m';
// const COLORS = ['\x1b[41m', '\x1b[42m', '\x1b[43m', '\x1b[44m', '\x1b[45m', '\x1b[46m']; // Background colors

function resizeToPowerOfTwo(arr: Float32Array): Float32Array {
  const length = arr.length;
  const powerOfTwo = Math.pow(2, Math.floor(Math.log2(length))); // Nearest lower power of two
  return arr.slice(0, powerOfTwo);
}

// function drawVuMeter(bins: { f: number; mag: number }[]) {
//   console.log(CLEAR_SCREEN); // Clear the screen

//   bins.forEach((bin, index) => {
//     const magnitude = Math.min(Math.max(bin.mag, 0), 1); // Clamp magnitude between 0 and 1
//     const barLength = Math.floor(magnitude * width); // Scale magnitude to 20 rows
//     const color = COLORS[index % COLORS.length]; // Cycle through colors

//     // Draw the bar
//     // console.log(`${color}${' '.repeat(barLength)}${RESET_COLOR} ${bin.f.toFixed(1)} Hz`);
//     // draw freq first and then bar, pad freq with spaces to its always the same width
//     console.log(
//       `${bin.f.toFixed(1).padStart(6, ' ')} ${color}${' '.repeat(barLength)}${RESET_COLOR}`,
//     );
//   });
// }

// real time log datastream
recording.stream().on('data', (data: Buffer) => {
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
    const phasors = fft(resizedData);
    const frequencies = util.fftFreq(phasors, opts.sampleRate);
    const magnitudes = util.fftMag(phasors);

    const both = frequencies.map((f, ix) => ({
      frequency: f,
      magnitude: magnitudes[ix],
    }));

    // console.log(both);
    // map results into n frequency bins, each bin should an object with an average frequency and a average magnitude
    const n = resolution;
    const binSize = frequencies.length / n;
    const bins: { f: number; mag: number }[] = [];
    for (let i = 0; i < n; i++) {
      const start = Math.floor(i * binSize);
      const end = Math.floor((i + 1) * binSize);
      const bin = both.slice(start, end);
      const avgFrequency = bin.reduce((acc, val) => acc + val.frequency, 0) / bin.length;
      const avgMagnitude = bin.reduce((acc, val) => acc + val.magnitude, 0) / bin.length;
      bins.push({ f: avgFrequency, mag: avgMagnitude });
    }
    // drawVuMeter(bins.slice(0, cap)); // Update the visualization
    // 484.5, 516.8, 635.2, 570.6
    const a: number | undefined = bins.find((bin) => bin.f > 484 && bin.f < 485)?.mag;
    const b: number | undefined = bins.find((bin) => bin.f > 516 && bin.f < 517)?.mag;
    const c: number | undefined = bins.find((bin) => bin.f > 635 && bin.f < 636)?.mag;
    const d: number | undefined = bins.find((bin) => bin.f > 570 && bin.f < 571)?.mag;
    if (a && b && c && d) {
      console.log('Sparks:', a, b, c, d);
      renderSparks(a, b, c, d);
    }
  } catch (error) {
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
