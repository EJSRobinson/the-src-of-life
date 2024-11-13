// import ws281x from 'rpi-ws281x-native';
// //import { deadPixels } from './structure';
// import { expandedMappingJoined } from './structure';
// import { Theme, colorwheel, fade } from './colourThems';

// export const flash = (
//   interval: NodeJS.Timeout | null,
//   brightness: number,
//   speed: number,
//   theme: Theme,
// ) => {
//   const ledLength = 150;
//   const channel = ws281x(ledLength, {
//     stripType: ws281x.stripType.WS2811,
//     gpio: 21,
//     brightness: (() => {
//       let result = brightness * 2.55;
//       result = Math.round(result);
//       if (result > 255) result = 255;
//       if (result < 0) result = 0;
//       return result;
//     })(),
//   });

//   // eslint-disable-next-line no-console
//   let offset2 = 0;
//   if (interval) {
//     clearInterval(interval);
//     interval = null;
//   }
//   interval = setInterval(() => {
//     const colorArray = channel.array;
//     for (let i = 0; i < channel.count; i++) {
//       colorArray[i] = 0x000000;
//     }
//     const max = 10;
//     // select 3 random numbers between 0 and max
//     const randomNumbers = [];
//     while (randomNumbers.length < 3) {
//       const r = Math.floor(Math.random() * max);
//       if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
//     }

//     // for (const segment of expandedMappingJoined) {
//     //   if (Math.random() > prop) {
//     //     for (let i = 0; i < segment.addrs.length; i++) {
//     //       colorArray[segment.addrs[i]] = colorwheel(fade(theme, offset2));
//     //     }
//     //   }
//     // }
//     offset2 = offset2 + 0.1;
//     ws281x.render(colorArray);
//   }, 1000 / speed);
// };
