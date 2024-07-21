// SizeUtils.js
import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

export const SizeUtils = {
  // Convert pixels to dp (device-independent pixels)
  pxToDp: px =>
    PixelRatio.roundToNearestPixel((px * width) / guidelineBaseWidth),

  // Convert pixels to sp (scale-independent pixels)
  pxToSp: px =>
    PixelRatio.roundToNearestPixel((px * height) / guidelineBaseHeight),

  // Calculate responsive width based on the guideline
  responsiveWidth: percentage => (width * percentage) / 100,

  // Calculate responsive height based on the guideline
  responsiveHeight: percentage => (height * percentage) / 100,

  // Define size ranges for different devices
  getSizeRange: () => {
    if (width < 340) {
      return 'small';
    } else if (width < 600) {
      return 'medium';
    } else {
      return 'large';
    }
  },
};


export const generateUniqueId = () => {
  // Generate a random string
  const randomString = Math.random().toString(36).substring(7);
  // Get current timestamp
  const timestamp = new Date().getTime();
  // Concatenate timestamp and random string
  return `${timestamp}-${randomString}`;
};
