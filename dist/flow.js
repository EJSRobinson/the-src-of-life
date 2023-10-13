"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const rainbow_1 = require("./rainbow");
const ledLength = 200;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, { stripType: rpi_ws281x_native_1.default.stripType.WS2811, gpio: 21, brightness: 255 });
const clearArray = () => {
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = 0x000000;
    }
};
const genSnake = (offset, array, snakeLength) => {
    for (let i = offset; i < offset + snakeLength; i++) {
        for (let j = 0; j < snakeLength; j++) {
            let ledNumber = i + j;
            if (ledNumber > channel.count) {
                ledNumber = ledNumber - channel.count;
            }
            array[ledNumber] = (0, rainbow_1.colorwheel)((colorOffset + i));
        }
    }
};
let offset = 0;
let colorOffset = 0;
setInterval(() => {
    colorOffset = (colorOffset + 1) % 256;
}, 1000 / 10);
const colorArray = channel.array;
setInterval(() => {
    clearArray();
    genSnake(offset, colorArray, 5);
    genSnake((offset + 100) % channel.count, colorArray, 5);
    rpi_ws281x_native_1.default.render(colorArray);
    offset = (offset + 1) % channel.count;
}, 1000 / 30);
rpi_ws281x_native_1.default.render(colorArray);
