import ws281x from 'rpi-ws281x-native';
import * as keypress from 'keypress';

const ledLength = 194;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: 255,
});

channel;

// const colorArray = channel.array;
// for (let i = 0; i < channel.count; i++) {
//   colorArray[i] = 0x000000;
// }
// ws281x.render(colorArray);

keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
