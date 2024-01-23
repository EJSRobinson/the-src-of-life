"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_1 = __importDefault(require("rpi-ws281x"));
class Example {
    constructor() {
        this.config = {};
        // Number of leds in my strip
        this.config.leds = 50;
        // Use DMA 10 (default 10)
        this.config.dma = 10;
        // Set full brightness, a value from 0 to 255 (default 255)
        this.config.brightness = 255;
        // Set the GPIO number to communicate with the Neopixel strip (default 18)
        this.config.gpio = 18;
        // The RGB sequence may vary on some strips. Valid values
        // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
        // Default is "rgb".
        // RGBW strips are not currently supported.
        this.config.stripType = 'grb';
        // Configure ws281x
        rpi_ws281x_1.default.configure(this.config);
    }
    run() {
        // Create a pixel array matching the number of leds.
        // This must be an instance of Uint32Array.
        const pixels = new Uint32Array(this.config.leds);
        // Create a fill color with red/green/blue.
        const red = 255, green = 0, blue = 0;
        const color = (red << 16) | (green << 8) | blue;
        for (let i = 0; i < this.config.leds; i++)
            pixels[i] = color;
        // Render to strip
        rpi_ws281x_1.default.render(pixels);
    }
}
;
const example = new Example();
example.run();
