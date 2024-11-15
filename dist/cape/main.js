"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const colourThems_1 = require("./colourThems");
const conv_1 = require("./conv");
// import { flash } from './flash';
const off_1 = require("./off");
const pulse_1 = require("./pulse");
const pulse2_1 = require("./pulse2");
// eslint-disable-next-line prefer-const
let mainInterval = null;
const main = (topic, payload) => {
    let message = {};
    try {
        message = JSON.parse(payload);
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error parsing message', e);
        return;
    }
    console.log(topic, message);
    switch (topic.split('/')[2]) {
        case 'pulse':
            if (message.brightness !== undefined && message.speed !== undefined) {
                (0, pulse_1.pulse)(mainInterval, message.brightness, message.speed);
            }
            break;
        case 'pulse2':
            if (message.brightness !== undefined &&
                message.speed !== undefined &&
                message.theme !== undefined) {
                const theme = colourThems_1.themes.find((t) => t.name === message.theme);
                if (theme !== undefined) {
                    (0, pulse2_1.pulse2)(mainInterval, message.brightness, message.speed, theme);
                }
            }
            break;
        case 'conv':
            if (message.brightness !== undefined &&
                message.speed !== undefined &&
                message.theme !== undefined) {
                const theme = colourThems_1.themes.find((t) => t.name === message.theme);
                if (theme !== undefined) {
                    (0, conv_1.conv)(mainInterval, message.brightness, message.speed, theme);
                }
            }
            break;
        case 'flash':
            if (message.brightness !== undefined &&
                message.speed !== undefined &&
                message.theme !== undefined) {
                const theme = colourThems_1.themes.find((t) => t.name === message.theme);
                if (theme !== undefined) {
                    // flash(mainInterval, message.brightness, message.speed, theme);
                }
            }
            break;
        case 'off':
            (0, off_1.off)(mainInterval);
    }
};
exports.main = main;
