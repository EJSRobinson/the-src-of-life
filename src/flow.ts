import ws281x from 'rpi-ws281x-native';
import { colorwheel } from './rainbow';

const ledLength = 200;

const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });

const snakeLength = 10;

const colorArray = channel.array;

const getArray = (offset: number) => {
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
  for (let i = offset; i < offset + snakeLength; i++) {
    for (let j = 0; j < snakeLength; j++) {
      let ledNumber = i + j;
      if (ledNumber > channel.count) {
        ledNumber = ledNumber - channel.count;
      }
      colorArray[ledNumber] = colorwheel((offset + i) % channel.count);
    }
  }
}
let offset = 0;
setInterval(()=>{
  getArray(offset);
  ws281x.render(colorArray);
  offset = (offset + 1) % channel.count;
}, 1000 / 30)
ws281x.render(colorArray);