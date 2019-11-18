// see https://stackoverflow.com/questions/14819058/mixing-two-colors-naturally-in-javascript

// colorChannelA and colorChannelB are ints ranging from 0 to 255
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix) {
  const channelA = colorChannelA * amountToMix;
  const channelB = colorChannelB * (1 - amountToMix);
  return parseInt(channelA + channelB, 10);
}
// rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
// example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB, amountToMix) {
  const r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  const g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  const b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r},${g},${b})`;
}

const colorFromScale = function colorFromScale(value, min, max, inverted) {
  if (value >= min && value <= max) {
    const cutValue = Math.max(Math.min(value, max), min);
    const normalized = (cutValue - min) / (max - min);
    const finalValue = inverted ? 1 - normalized : normalized;
    return colorMixer([226, 45, 79], [195, 195, 230], finalValue);
  }
  return 'grey';
};

export default colorFromScale;
