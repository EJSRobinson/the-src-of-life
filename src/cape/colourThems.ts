export type Theme = {
  name: string;
  colours: number[];
};

export const themes: Theme[] = [
  {
    name: 'red',
    colours: [0xff0046, 0xff0000, 0xff4600, 0xff7500],
  },
];

export const fade = (theme: Theme, prop: number) => {
  const start = theme.colours[0];
  const end = theme.colours[1];
  const normaliseProp = ((prop * 100) % 100) / 100;
  if (end > start) {
    return Math.round(start + (end - start) * normaliseProp);
  } else {
    return Math.round(start - (start - end) * normaliseProp);
  }
};
