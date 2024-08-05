"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const off_1 = require("./off");
const pulse_1 = require("./pulse");
// eslint-disable-next-line prefer-const
let mainInterval = null;
const main = (topic, payload) => {
    const message = JSON.parse(payload);
    switch (topic.split('/')[2]) {
        case 'pulse':
            (0, pulse_1.pulse)(mainInterval, message.brightness, message.speed);
            break;
        case 'off':
            (0, off_1.off)(mainInterval);
    }
};
exports.main = main;
