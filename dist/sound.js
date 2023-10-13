"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const spawn = require('child_process').spawn;
const proces = spawn('arecord', console.log(['-D', 'plughw:0,0', '-f', 'dat'])); // invoking the arecord command
proces.on('exit', function (code, sig) {
    console.log('arecord exited with code ' + code);
});
proces.stderr.on('data', function (data) {
    console.log("music record stderr :" + data);
});
setTimeout(function () {
    proces.kill('SIGTERM');
}, 30000);
