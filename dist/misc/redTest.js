"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const ledLength = 200;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
    stripType: rpi_ws281x_native_1.default.stripType.WS2811,
    gpio: 21,
    brightness: 255,
});
const colorArray = channel.array;
for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x330000;
}
setInterval(() => {
    rpi_ws281x_native_1.default.render(colorArray);
}, 100);
