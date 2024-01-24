"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const keypress_1 = __importDefault(require("keypress"));
const ledLength = 194;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
    stripType: rpi_ws281x_native_1.default.stripType.WS2811,
    gpio: 21,
    brightness: 255,
});
channel;
// const colorArray = channel.array;
// for (let i = 0; i < channel.count; i++) {
//   colorArray[i] = 0x000000;
// }
// ws281x.render(colorArray);
(0, keypress_1.default)(process.stdin);
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();
