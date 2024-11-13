"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_microphone_1 = __importDefault(require("node-microphone"));
const mic = new node_microphone_1.default();
mic.startRecording({
    bitwidth: 16,
    encoding: 'signed-integer',
    rate: 44100,
    channels: 1,
    device: 'hw:1,0',
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
