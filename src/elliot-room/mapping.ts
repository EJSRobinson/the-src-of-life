export type tree = {
  label: string;
  stem: number[];
  branches: tree[] | null;
};

export const roomTree: tree = {
  label: 'root',
  stem: [],
  branches: [
    {
      label: '1A',
      stem: [0, 1, 3, 4, 5, 6, 7, 8],
      branches: [
        {
          label: '1B',
          stem: [9, 10, 11, 12, 13],
          branches: [
            {
              label: '1C',
              stem: [14],
              branches: [
                {
                  label: '1D',
                  stem: [15, 16],
                  branches: null,
                },
                {
                  label: '1E',
                  stem: [20, 19, 18, 17],
                  branches: null,
                },
              ],
            },
            {
              label: '1F',
              stem: [21, 22, 23, 24, 25],
              branches: null,
            },
          ],
        },
        {
          label: '1G',
          stem: [46, 45, 44, 43, 42, 41],
          branches: [
            {
              label: '1H',
              stem: [26, 27, 28, 29, 30, 31, 32, 33],
              branches: null,
            },
            {
              label: '1I',
              stem: [40, 39, 38, 37, 36, 35, 34],
              branches: null,
            },
          ],
        },
        {
          label: '1J',
          stem: [47, 48, 49, 50, 51, 52, 53, 54],
          branches: [
            {
              label: '1K',
              stem: [55, 56, 57, 58, 59],
              branches: null,
            },
            {
              label: '1L',
              stem: [68],
              branches: [
                {
                  label: '1M',
                  stem: [69, 70, 71, 72, 73],
                  branches: null,
                },
                {
                  label: '1N',
                  stem: [67, 66, 65, 64, 63, 62, 61, 60],
                  branches: null,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: '2A',
      stem: [
        98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
      ],
      branches: [
        {
          label: '2B',
          stem: [80, 79, 78, 77, 76, 75, 74],
          branches: null,
        },
        {
          label: '2C',
          stem: [116, 117, 118, 119, 120, 121, 122, 123],
          branches: null,
        },
      ],
    },
    {
      label: '3A',
      stem: [97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81],
      branches: [
        {
          label: '3B',
          stem: [116, 117, 118, 119, 120, 121, 122, 123],
          branches: null,
        },
        {
          label: '3C',
          stem: [144, 143, 142, 141, 129],
          branches: [
            {
              label: '3D',
              stem: [127, 126, 125, 124],
              branches: null,
            },
            {
              label: '3E',
              stem: [132],
              branches: null,
            },
          ],
        },
        {
          label: '3F',
          stem: [145, 146, 147],
          branches: [
            {
              label: '3G',
              stem: [148, 139],
              branches: [
                {
                  label: '3H',
                  stem: [140, 128],
                  branches: null,
                },
                {
                  label: '3I',
                  stem: [133],
                  branches: null,
                },
              ],
            },
            {
              label: '3J',
              stem: [149, 150, 151, 152, 153],
              branches: null,
            },
          ],
        },
      ],
    },
    {
      label: '4A',
      stem: [193, 192, 191, 190, 189, 188, 187, 186],
      branches: [
        {
          label: '4B',
          stem: [169, 170, 171, 172],
          branches: [
            {
              label: '4C',
              stem: [173, 174],
              branches: null,
            },
            {
              label: '4D',
              stem: [175, 153, 159, 156],
              branches: [
                {
                  label: '4E',
                  stem: [157],
                  branches: null,
                },
                {
                  label: '4F',
                  stem: [155, 154],
                  branches: null,
                },
              ],
            },
          ],
        },
        {
          label: '4G',
          stem: [168, 167, 166, 165, 164, 163, 162, 161, 160, 176, 177, 178, 179],
          branches: [
            {
              label: '4H',
              stem: [179, 180],
              branches: null,
            },
            {
              label: '4I',
              stem: [183, 184, 185],
              branches: null,
            },
            {
              label: '4J',
              stem: [181, 182],
              branches: null,
            },
          ],
        },
      ],
    },
  ],
};

import ws281x from 'rpi-ws281x-native';

const ledLength = 194;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: 255,
});

type cursor = {
  element: number | null;
  subject: tree;
};

let cursors: cursor[] = [];

cursors.push({
  element: null,
  subject: roomTree,
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const wave = async (timestep: number, color: number) => {
  console.log('Start Loop');
  while (cursors.length > 0) {
    const colorArray = channel.array;
    let deleteMarkedCursors: number[] = [];
    for (let i = 0; i < cursors.length; i++) {
      // Loop through cursors
      const cursor = cursors[i];
      if (cursor.element === null) {
        cursor.element = cursor.subject.stem[0];
      } else {
        const newIndex = cursor.subject.stem.indexOf(cursor.element) + 1;
        if (newIndex < cursor.subject.stem.length) {
          cursor.element = cursor.subject.stem[newIndex];
        } else {
          if (cursor.subject.branches === null) {
            // remove this cursor from cursors array
          } else {
            for (let j = 0; j < cursor.subject.branches.length; j++) {
              cursors.push({
                element: null,
                subject: cursor.subject.branches[j],
              });
            }
          }
          deleteMarkedCursors.push(i);
        }
      }
      colorArray[cursor.element] = color;
    }
    // render
    ws281x.render(colorArray);

    // Remove cursors that have reached the end of their stem
    const newCursors: cursor[] = [];
    for (let i = 0; i < cursors.length; i++) {
      if (!deleteMarkedCursors.includes(i)) {
        newCursors.push(cursors[i]);
      }
    }
    cursors = newCursors;
    deleteMarkedCursors = [];

    // Reset too off
    await wait(timestep);
    for (let i = 0; i < colorArray.length; i++) {
      colorArray[i] = 0x000000;
    }
  }
};

wave(1000 / 20, 0x0000ff);
