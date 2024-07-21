// ColorUtils.js
export const ColorUtils = {
  // Shade a color by a given percentage (lighten or darken)
  shadeColor: (color, percent) => {
    const f = parseInt(color.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00ff;
    const B = f & 0x0000ff;
    return `#${(
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)}`;
  },

  // Generate a random hex color
  randomHexColor: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,

  // Add other color-related utility functions here
};
export const COLORS = {
  // General Colors
  primary: '#3a48bb',
  secondary: '#5D2DFD',
  transparent: '#00000000',

  // Text Colors
  text: 'rgb(44, 63, 94)',
  labelText: '#868F9F',
  textInput: '#2C3F5E',

  // Background Colors
  background: '#fbfbfb',
  grayBackground: '#FAFBFC',
  lightShadeBlue: '#BBB9E8',
  fadePinkBackground: '#fefdff',
  lightShadePink: '#f4eef6',

  // Button Colors
  buttonGreen: '#37E39F',
  buttonPurple: '#515DF1',

  // Status Colors
  successGreen: '#37E39F',
  errorRed: '#F22121',

  // Grayscale
  white: '#ffffff',
  black: '#000000',
  gray: '#6A6A6A',
  darkGray: '#2C3F5E',
  lightGray: '#bdbdbd',
  textGray: '#4F4F4F',
  textDark: '#222823',
  semiDarkGray: '#334335',
  lightTextGray: '#535353',
  borderGray: '#E7E7E7',
  iconGray: '#8B9096',

  // Theme-specific or Component-specific Colors
  riderTheme: {
    background: '#F5F7FC',
    text: '#191344',
  },

  // Additional Colors
  red: '#DC2626',
  semiDarkRed: '#F34E4E',
  blue: 'blue',
  darkSlateBlue: 'darkslateblue',
  fcmbPurpleLight2: '#CAB8D6',
  fcmbPurpleLight: '#E4D8EB',
  fcmbPurpleLighter: '#efe6f3',
  fcmbPurple: '#5F138D',
  fcmbPurpleText: '#5C068C',
  fcmbOrange: '#FAB613',
  fcmbYellow: '#FBBF24',
  darkAsh: '#4F4F4F',
  lightRed: '#ff8989',
  lightPurple: '#eddaeb',
  green: '#09B47C',
  grayWhite: '#fafafa',
  fcmbBrown: '#78350F',
  veryLightRed: '#fbe9e9',
};
