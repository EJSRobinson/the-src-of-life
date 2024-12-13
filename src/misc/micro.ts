// const recorder = require('node-record-lpcm16')
// const fs = require('fs')
import * as recorder from 'node-record-lpcm16';
// import * as fs from 'fs';

// const file = fs.createWriteStream('output.wav', { encoding: 'binary' });

const recording = recorder.record({
  sampleRate: 44100,
  channels: 1,
  recorder: 'arecord',
  device: 'hw:1,0',
});

console.log('Recording started');
// recording.stream().pipe(file);

// real time log datastream
recording.stream().on('data', (data) => {
  console.log(data);
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
