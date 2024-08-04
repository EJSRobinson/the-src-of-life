import ws281x from 'rpi-ws281x-native';
import keypress from 'keypress';

const ledLength = 150;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: 255,
});

channel;

keypress(process.stdin);

let pointer = 0;

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
  if (key && key.name == 'right') {
    pointer = (pointer + 1) % channel.count;
    console.log(pointer);
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      colorArray[i] = pointer === i ? 0x33ff33 : 0x330000;
    }
    ws281x.render(colorArray);
  }
  if (key && key.name == 'left') {
    pointer = (pointer - 1 + channel.count) % channel.count;
    console.log(pointer);
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      colorArray[i] = pointer === i ? 0x33ff33 : 0x330000;
    }
    ws281x.render(colorArray);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
