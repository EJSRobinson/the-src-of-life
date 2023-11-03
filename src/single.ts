import ws281x from 'rpi-ws281x-native';

const ledLength = 194;

const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });


const colorArray = channel.array;
for (let i = 0; i < channel.count; i++) {
  colorArray[i] = 0x00FF00;
  console.log(i);
}

ws281x.render(colorArray);