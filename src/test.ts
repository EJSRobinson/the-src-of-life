import ws281x from 'rpi-ws281x-native';

const channel = ws281x(50, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });

function iteratorToRainbowHex(i: number): string {
  // Ensure that i is within the range [0, 50]
  i = Math.max(0, Math.min(50, i));

  // Calculate the hue value based on the range of i
  const hue = (i / 50) * 360; // 0° to 360°

  // Convert HSL to RGB
  const h = hue / 360;
  const s = 0.8; // You can adjust saturation and lightness as needed
  const l = 0.5; // You can adjust saturation and lightness as needed

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 1) {
    r = c;
    g = x;
  } else if (h < 2) {
    r = x;
    g = c;
  } else if (h < 3) {
    g = c;
    b = x;
  } else if (h < 4) {
    g = x;
    b = c;
  } else if (h < 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  // Convert RGB to hex
  const red = Math.floor((r + m) * 255);
  const green = Math.floor((g + m) * 255);
  const blue = Math.floor((b + m) * 255);

  const redHex = red.toString(16).padStart(2, '0');
  const greenHex = green.toString(16).padStart(2, '0');
  const blueHex = blue.toString(16).padStart(2, '0');

  return `#${redHex}${greenHex}${blueHex}`;
}

const colorArray = channel.array;
for (let i = 0; i < channel.count; i++) {
  colorArray[i] = iteratorToRainbowHex(i);
}

ws281x.render();