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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const node_record_lpcm16_1 = __importDefault(require("node-record-lpcm16"));
// Define configuration for the microphone
const options = {
    device: 'hw:1,0',
    channels: 1,
    rate: 16000,
    encoding: 'LINEAR16',
};
// Path for the output file
const outputPath = 'output.wav';
// Create a writable stream to save audio to a file
const fileStream = fs.createWriteStream(outputPath);
// Function to start recording
const startRecording = () => {
    console.log('Recording... Press Ctrl+C to stop.');
    const audioStream = node_record_lpcm16_1.default.start(options);
    // Pipe audio stream to the file
    audioStream.pipe(fileStream);
    // Handle audio data in real-time (optional)
    audioStream.on('data', (chunk) => {
        console.log('Received audio data chunk of size:', chunk.length);
    });
    // Stop recording on Ctrl+C
    process.on('SIGINT', () => {
        node_record_lpcm16_1.default.stop();
        console.log(`\nRecording stopped. Audio saved as ${outputPath}`);
        process.exit();
    });
};
// Start the recording process
startRecording();
