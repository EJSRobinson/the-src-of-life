"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const keypress_1 = __importDefault(require("keypress"));
const mapping_1 = require("./mapping");
const ledLength = 194;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
    stripType: rpi_ws281x_native_1.default.stripType.WS2811,
    gpio: 21,
    brightness: 255,
});
channel;
const traverseBranch = (branch, searchIndex, runningIndex) => {
    const stem = branch.stem;
    for (let i = 0; i < stem.length; i++) {
        if (runningIndex === searchIndex) {
            return { led: stem[i], label: branch.label };
        }
        runningIndex++;
    }
    for (let i = 0; i < branch.branches.length; i++) {
        const result = traverseBranch(branch.branches[i], searchIndex, runningIndex);
        if (result !== null) {
            return result;
        }
    }
    return null;
};
const getLedFromMapping = (index) => {
    return traverseBranch(mapping_1.roomTree, index, 0);
};
(0, keypress_1.default)(process.stdin);
let pointer = 0;
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
    if (key && key.name == 'right') {
        pointer = (pointer + 1) % channel.count;
    }
    if (key && key.name == 'left') {
        pointer = (pointer - 1 + channel.count) % channel.count;
    }
    const led = getLedFromMapping(pointer);
    console.log(led);
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = pointer === i ? 0x33ff33 : 0x330000;
    }
    rpi_ws281x_native_1.default.render(colorArray);
});
process.stdin.setRawMode(true);
process.stdin.resume();
