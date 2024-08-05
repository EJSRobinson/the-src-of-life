"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fade = exports.themes = void 0;
exports.themes = [
    {
        name: 'red',
        colours: [0xff0000, 0xff0000, 0xff4600, 0xffd000],
    },
];
const fade = (theme, prop) => {
    const start = theme.colours[0];
    const end = theme.colours[1];
    const normaliseProp = ((prop * 100) % 100) / 100;
    if (end > start) {
        return Math.round(start + (end - start) * normaliseProp);
    }
    else {
        return Math.round(start - (start - end) * normaliseProp);
    }
};
exports.fade = fade;
