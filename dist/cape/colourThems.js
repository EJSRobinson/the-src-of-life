"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fade = exports.themes = void 0;
exports.themes = [
    {
        name: 'red',
        colours: [0xff0046, 0xff0000, 0xff4600, 0xff7500],
    },
];
const fade = (theme, propotion) => {
    const start = theme.colours[0];
    const end = theme.colours[1];
    if (end > start) {
        return Math.round(start + (end - start) * propotion);
    }
    else {
        return Math.round(start - (start - end) * propotion);
    }
};
exports.fade = fade;
