// const recorder = require('node-record-lpcm16')
// const fs = require('fs')
import * as recorder from 'node-record-lpcm16';
import { fft, util } from 'fft-js';
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
recording.stream().on('data', (data: Buffer) => {
  try {
    const data1 = data.slice(0, 32);
    // Decode 16-bit PCM to Float32
    const dataArr = new Float32Array(data1.length / 2); // Divide by 2 for 16-bit PCM
    for (let i = 0; i < data1.length; i += 2) {
      const value = data.readInt16LE(i); // Read 16-bit signed integer
      dataArr[i / 2] = value / 32768; // Normalize to range [-1, 1]
    }

    console.log(dataArr);

    // Perform FFT
    const phasors = fft(dataArr);
    const frequencies = util.fftFreq(phasors, opts.sampleRate);
    const magnitudes = util.fftMag(phasors);

    const both = frequencies.map((f, ix) => ({
      frequency: f,
      magnitude: magnitudes[ix],
    }));

    console.log(both);
  } catch (error) {
    console.error('Error processing audio data:', error);
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
