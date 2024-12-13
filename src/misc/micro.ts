import * as fs from 'fs';
import record from 'node-record-lpcm16';

// Define the configuration interface for recording options
interface RecordOptions {
  device: string;
  channels: number;
  rate: number;
  encoding: string;
}

// Define configuration for the microphone
const options: RecordOptions = {
  device: 'hw:1,0', // Replace with your microphone's device
  channels: 1, // Mono channel
  rate: 16000, // Sample rate in Hz
  encoding: 'LINEAR16',
};

// Path for the output file
const outputPath: string = 'output.wav';

// Create a writable stream to save audio to a file
const fileStream = fs.createWriteStream(outputPath);

// Function to start recording
const startRecording = (): void => {
  console.log('Recording... Press Ctrl+C to stop.');

  const audioStream = record.start(options);

  // Pipe audio stream to the file
  audioStream.pipe(fileStream);

  // Handle audio data in real-time (optional)
  audioStream.on('data', (chunk: Buffer) => {
    console.log('Received audio data chunk of size:', chunk.length);
  });

  // Stop recording on Ctrl+C
  process.on('SIGINT', () => {
    record.stop();
    console.log(`\nRecording stopped. Audio saved as ${outputPath}`);
    process.exit();
  });
};

// Start the recording process
startRecording();
