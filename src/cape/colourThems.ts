export type Theme = {
  name: string;
  lower: number;
  upper: number;
};

export const themes: Theme[] = [
  {
    name: 'red',
    lower: 248,
    upper: 13,
  },
  {
    name: 'green',
    lower: 80,
    upper: 120,
  },
  {
    name: 'blue',
    lower: 140,
    upper: 190,
  },
  {
    name: 'rainbow',
    lower: 0,
    upper: 255,
  },
];

export const fade = (theme: Theme, propotion: number) => {
  const p = ((propotion * 100) % 100) / 100;
  let delta = 0;
  if (theme.lower > theme.upper) {
    delta = 255 - theme.lower + theme.upper;
  } else {
    delta = theme.upper - theme.lower;
  }
  const result = theme.lower + Math.round(delta * p);
  console.log(result);
  return result % 255;
};

export function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) {
    return rgb2Int(255 - pos * 3, 0, pos * 3);
  } else if (pos < 170) {
    pos -= 85;
    return rgb2Int(0, pos * 3, 255 - pos * 3);
  } else {
    pos -= 170;
    return rgb2Int(pos * 3, 255 - pos * 3, 0);
  }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
