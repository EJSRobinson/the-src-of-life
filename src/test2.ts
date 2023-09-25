import ws281x from 'rpi-ws281x';

// One time initialization
ws281x.configure({leds:16});

// Create my pixels
const pixels = new Uint32Array(16);

// Render pixels to the Neopixel strip
ws281x.render(pixels);