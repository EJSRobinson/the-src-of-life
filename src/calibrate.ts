import ws281x from 'rpi-ws281x-native';

const ledLength = 200;

const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });


const colorArray = channel.array;
for (let i = 0; i < channel.count; i++) {
  colorArray[i] = 0xFFFFFF;
  if (i % 5 === 0) {
    colorArray[i] = 0xFF0000;
  }
  if (i % 10 === 0) {
    colorArray[i] = 0x00FF00;
  }
  if (i % 50 === 0) {
    colorArray[i] = 0x0000FF;
  }
  if (i % 100 === 0) {
    colorArray[i] = 0xFF00FF;
  }
}
ws281x.render(colorArray);