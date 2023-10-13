import ws281x from 'rpi-ws281x-native';
import { colorwheel } from './rainbow';

const ledLength = 195;
const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });

// SETTINGS;
const colorSpeed = 100;
const speed = 33.5;
const snakeOpts = {
  snakes: 15,
  snakeLength: 6,
  seperation: 0,
}

snakeOpts.seperation = Math.floor(channel.count / snakeOpts.snakes);

const clearArray = () => {
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
}

const genSnake = (offset: number, array: number[], snakeLength: number, reverse: boolean) => {
  let localOffset = JSON.parse(JSON.stringify(offset));
  if (reverse) {
    localOffset = channel.count - offset;
  }
  for (let i = localOffset; i < localOffset + snakeLength; i++) {
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
}, 1000 / colorSpeed)

const colorArray = channel.array;

setInterval(()=>{
  clearArray();
  for (let i = 0; i < snakeOpts.snakes; i++) {
    genSnake((offset + (i * snakeOpts.seperation)) % channel.count, colorArray, snakeOpts.snakeLength, false);
  }
  ws281x.render(colorArray);
  offset = (offset + 1) % channel.count;
}, 1000 / speed)
ws281x.render(colorArray);