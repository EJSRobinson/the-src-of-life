import ws281x from 'rpi-ws281x-native';
import { colorwheel } from './rainbow';

const ledLength = 200;

const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });

const clearArray = () => {
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
}

const genSnake = (offset: number, array: number[], snakeLength: number) => {
  for (let i = offset; i < offset + snakeLength; i++) {
    for (let j = 0; j < snakeLength; j++) {
      let ledNumber = i + j;
      if (ledNumber > channel.count) {
        ledNumber = ledNumber - channel.count;
      }
      array[ledNumber] = colorwheel((colorOffset + i));
    }
  }
}
let offset = 0;
let colorOffset = 0;

setInterval(()=>{
  colorOffset = (colorOffset + 1) % 256;
}, 1000 / 10)

const colorArray = channel.array;

const snakeOpts = {
  snakes: 3,
  snakeLength: 5,
  seperation: 40,
}

setInterval(()=>{
  clearArray();
  for (let i = 0; i < snakeOpts.snakes; i++) {
    genSnake((offset + (i * snakeOpts.seperation)) % channel.count, colorArray, snakeOpts.snakeLength);
  }
  ws281x.render(colorArray);
  offset = (offset + 1) % channel.count;
}, 1000 / 30)
ws281x.render(colorArray);