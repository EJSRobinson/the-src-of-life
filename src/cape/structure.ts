export const deadPixels = [
  0, 1, 2, 3, 28, 29, 30, 63, 64, 65, 81, 102, 103, 112, 121, 122, 135, 136, 137,
];

type segment = {
  start: number;
  end: number;
  positionX: number | null;
  side?: 'l' | 'r';
};

type expandedSegment = {
  addrs: number[];
  positionX: number | null;
  side?: 'l' | 'r';
};

const mapping: segment[] = [
  { start: 4, end: 9, positionX: 0, side: 'r' },
  { start: 10, end: 27, positionX: 0, side: 'r' },
  { start: 47, end: 31, positionX: 0, side: 'l' },
  { start: 54, end: 48, positionX: 0, side: 'l' },
  { start: 55, end: 62, positionX: 0 },
  { start: 66, end: 69, positionX: 1, side: 'r' },
  { start: 70, end: 80, positionX: 1, side: 'r' },
  { start: 93, end: 82, positionX: 1, side: 'l' },
  { start: 96, end: 94, positionX: 1, side: 'l' },
  { start: 97, end: 101, positionX: 1 },
  { start: 104, end: 111, positionX: 2, side: 'r' },
  { start: 120, end: 113, positionX: 2, side: 'l' },
  { start: 123, end: 128, positionX: 3, side: 'l' },
  { start: 134, end: 129, positionX: 3, side: 'r' },
  { start: 138, end: 149, positionX: 4 },
];

export const expandedMapping: expandedSegment[] = mapping.flatMap(
  ({ start, end, positionX, side }) => {
    const addrs: number[] = [];
    if (end > start) {
      for (let i = start; i <= end; i++) {
        addrs.push(i);
      }
    } else {
      for (let i = start; i >= end; i--) {
        addrs.push(i);
      }
    }
    return { addrs, positionX, side };
  },
);
