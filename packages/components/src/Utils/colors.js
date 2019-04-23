const colors = {
  // Primary
  absoluteZero: '#004ADC',
  white: '#FFFFFF',
  text: '#222330',
  whiteSmoke: '#F3F4F9',
  // Secondary
  lightGray: '#D4D4D8',
  grayBlue: '#8E929C',
  oldSilver: '#82828C',
  textLight: '#545560',
  maximumRed: '#D72222',
  sunglow: '#FFD23F',
  celadonGreen: '#228572',
  lightningGreen: '#26A769',
  // Variations
  hover: '#003EBB',
  active: '#003B96',
  focus: '#B1CBF2',
  bgBlueHover: '#F0F5FD',
  bgBlueActive: '#E6ECF8',
  bgRedHover: '#FDF5F5',
  bgRedActive: '#FCEDED',
};

const formColors = {
  colorInputBg: colors.white,
  colorInputBorder: colors.grayBlue,
  colorInputBorderError: colors.maximumRed,
  colorInputBorderFocus: colors.absoluteZero,
  colorInputFg: colors.text,
  colorInputFocusShadow: colors.lightningGreen,
};

export default colors;
export { colors, formColors };
