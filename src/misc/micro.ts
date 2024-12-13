// const recorder = require('node-record-lpcm16')
// const fs = require('fs')
import * as recorder from 'node-record-lpcm16';
import * as fs from 'fs';

const file = fs.createWriteStream('output.wav', { encoding: 'binary' });

const recording = recorder.record({
  sampleRate: 44100,
  channels: 1,
  recorder: 'arecord',
  device: 'hw:1,0',
});
recording.stream().pipe(file);

// Pause recording after one second
setTimeout(() => {
  recording.pause();
}, 1000);

// Resume another second later
setTimeout(() => {
  recording.resume();
}, 2000);

// Stop recording after three seconds
setTimeout(() => {
  recording.stop();
}, 3000);
