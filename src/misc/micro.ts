// const recorder = require('node-record-lpcm16')
// const fs = require('fs')
import * as recorder from 'node-record-lpcm16';
import { fft, util } from 'fft-js';
// import * as fs from 'fs';

// const file = fs.createWriteStream('output.wav', { encoding: 'binary' });

const resolution = 512;
const cap = 110;
const width = 560;

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

const CLEAR_SCREEN = '\x1b[2J\x1b[H';
const RESET_COLOR = '\x1b[0m';

const COLORS = [
  '\x1b[41m', // Red
  '\x1b[42m', // Green
  '\x1b[43m', // Yellow
  '\x1b[44m', // Blue
  '\x1b[45m', // Magenta
  '\x1b[46m', // Cyan
  '\x1b[101m', // Bright Red
  '\x1b[102m', // Bright Green
  '\x1b[103m', // Bright Yellow
  '\x1b[104m', // Bright Blue
  '\x1b[105m', // Bright Magenta
  '\x1b[106m', // Bright Cyan
];

// const COLORS: any[] = [];

// Function to interpolate colors between two RGB points
// function interpolateColors(start, end, steps) {
//   const colors: any[] = [];
//   for (let i = 0; i < steps; i++) {
//     const r = Math.round(start[0] + ((end[0] - start[0]) * i) / (steps - 1));
//     const g = Math.round(start[1] + ((end[1] - start[1]) * i) / (steps - 1));
//     const b = Math.round(start[2] + ((end[2] - start[2]) * i) / (steps - 1));
//     const a: any = `\x1b[38;2;${r};${g};${b}m`;
//     colors.push(a);
//   }
//   return colors;
// }

// Rainbow color stops (red, orange, yellow, green, blue, indigo, violet)
// const rainbowStops = [
//   [255, 0, 0], // Red
//   [255, 127, 0], // Orange
//   [255, 255, 0], // Yellow
//   [0, 255, 0], // Green
//   [0, 0, 255], // Blue
//   [75, 0, 130], // Indigo
//   [148, 0, 211], // Violet
// ];

// // Generate the colors, interpolating between stops
// const colorsPerSegment = Math.ceil(110 / (rainbowStops.length - 1));
// for (let i = 0; i < rainbowStops.length - 1; i++) {
//   const segmentColors = interpolateColors(rainbowStops[i], rainbowStops[i + 1], colorsPerSegment);
//   COLORS.push(...segmentColors);
// }

// // Trim the array to exactly 110 colors
// while (COLORS.length > 110) {
//   COLORS.pop();
// }

// console.log(COLORS);

function resizeToPowerOfTwo(arr: Float32Array): Float32Array {
  const length = arr.length;
  const powerOfTwo = Math.pow(2, Math.floor(Math.log2(length))); // Nearest lower power of two
  return arr.slice(0, powerOfTwo);
}

function drawVuMeter(bins: { f: number; mag: number }[]) {
  console.log(CLEAR_SCREEN); // Clear the screen

  bins.forEach((bin, index) => {
    const magnitude = Math.min(Math.max(bin.mag, 0), 1); // Clamp magnitude between 0 and 1
    const barLength = Math.floor(magnitude * width); // Scale magnitude to 20 rows
    const color = COLORS[index % COLORS.length]; // Cycle through colors

    // Draw the bar
    // console.log(`${color}${' '.repeat(barLength)}${RESET_COLOR} ${bin.f.toFixed(1)} Hz`);
    // draw freq first and then bar, pad freq with spaces to its always the same width
    console.log(
      `${bin.f.toFixed(1).padStart(6, ' ')} ${color}${' '.repeat(barLength)}${RESET_COLOR}`,
    );
  });
}

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
    drawVuMeter(bins.slice(0, cap)); // Update the visualization
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
