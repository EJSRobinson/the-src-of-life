import ws281x from 'rpi-ws281x-native';
import keypress from 'keypress';
import { roomTree } from './mapping';
const ledLength = 194;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: 255,
});

channel;

const traverseBranch = (
  branch: any,
  searchIndex: number,
  runningIndex: number,
): { led: number; label: string } | null => {
  const stem = branch.stem;
  for (let i = 0; i < stem.length; i++) {
    if (runningIndex === searchIndex) {
      return { led: stem[i], label: branch.label };
    }
    runningIndex++;
  }
  for (let i = 0; i < branch.branches.length; i++) {
    const result = traverseBranch(branch.branches[i], searchIndex, runningIndex);
    if (result !== null) {
      return result;
    }
  }
  return null;
};

const getLedFromMapping = (index: number): { led: number; label: string } | null => {
  return traverseBranch(roomTree, index, 0);
};

keypress(process.stdin);

let pointer = 0;

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
  if (key && key.name == 'right') {
    pointer = (pointer + 1) % channel.count;
  }
  if (key && key.name == 'left') {
    pointer = (pointer - 1 + channel.count) % channel.count;
  }
  const led = getLedFromMapping(pointer);
  console.log(led);
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = pointer === i ? 0x33ff33 : 0x330000;
  }
  ws281x.render(colorArray);
});

process.stdin.setRawMode(true);
process.stdin.resume();
