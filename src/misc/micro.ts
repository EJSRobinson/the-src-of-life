import Mic from 'node-microphone';
const mic = new Mic();
mic.startRecording({
  bitwidth: 16,
  encoding: 'signed-integer',
  rate: 44100,
  channels: 1,
  device: 'hw:2,0',
  useDataEmitter: true,
});
// micStream.pipe(myWritableStream);
setTimeout(() => {
  console.log('stopped recording');
  mic.stopRecording();
}, 3000);
mic.on('info', (info) => {
  // convert info to string
  console.log('Info ->', info.toString());
});
mic.on('error', (error) => {
  console.log('Error ->', error);
});
mic.on('data', (data) => {
  console.log('Data ->', data);
});
