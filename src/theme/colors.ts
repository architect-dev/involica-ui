import { Colors } from './types'

export const baseColors = {
  failure: '#ED4B9E',
  primary: '#2F70FF',
  primaryBright: '#588cff',
  primaryDark: '#2559cc',
  secondary: '#40c2e9',
  success: '#31D0AA',
  warning: '#FFB237',
}

export const brandColors = {
  binance: '#F0B90B',

  DASH: '#154463',

  OASIS: '#88ACC9',
  PLAINS: '#80B145',
  MESA: '#D4916D',
  SUMMIT: '#7B7D93',
  EXPEDITION: '#ebf2fd',

  AUDIT: '#000418',
  ROLLOVER: '#DB00FF',
  BASE: '#3e7fa2',
  EVEREST: '#017B88',
  GLACIER: '#39749e',

  textGold: '#EE9F3D',
}

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: '#F2F2F2',
  cardHover: 'white',
  backgroundDisabled: '#F2F2F2',
  contrast: '#191326',
  invertedContrast: '#FFFFFF',
  input: '#eeeaf4',
  inputSecondary: '#46557d',
  tertiary: '#EFF4F5',
  text: '#575757',
  textShadow: 'rgba(87, 87, 87, 0.75)',
  textDisabled: '#828b93',
  textSubtle: '#46557d',
  borderColor: '#98a3ac',
  card: '#FFFFFF',
  ROADMAP: '#575757',
  selectorBackground: '#cacaca',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)',
  },
}

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  secondary: '#40c2e9',
  background: '#121421',
  cardHover: '#1e2237',
  backgroundDisabled: '#57585c',
  contrast: '#FFFFFF',
  invertedContrast: '#191326',
  input: '#FFFFFF',
  inputSecondary: '#9a9a9d',
  primaryDark: '#0098A1',
  tertiary: '#45464A',
  text: '#CDE7FF',
  textShadow: 'rgba(0, 0, 0, 0.5)',
  textDisabled: '#37383b',
  textSubtle: '#FFFFFF',
  borderColor: '#ebf2fd',
  card: '#0F152A',
  ROADMAP: '#E5E5E5',
  selectorBackground: '#41495f',
  DASH: '#3e7fa2',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
  },

  // OVERRIDDEN BRAND COLORS
  SUMMIT: '#A6CBDC',
}

export const textGold = '#EE9F3D'

export const elevationPalette = {
  BASE: ['#092E4E', '#0E3858', '#154463', '#3E80A2', '#609CB6', '#94BDCC'],
  DASH: ['#092E4E', '#0E3858', '#154463', '#3E80A2', '#609CB6', '#94BDCC'],
  OASIS: ['#1D4D57', '#35655D', '#638263', '#BBAA6A', '#C8BC89', '#D6CFB1'],
  PLAINS: ['#044820', '#0F6330', '#2F8846', '#94BB68', '#ABC887', '#C6D6B0'],
  MESA: ['#210402', '#370B06', '#5F2214', '#A2663E', '#B68660', '#CCAF94'],
  SUMMIT: ['#040707', '#2B3C44', '#557280', '#7BA6BB', '#A6CBDC', '#C3D8E0'],
  EXPEDITION: ['#3B2F60', '#865075', '#B16684', '#D48B8A', '#DDA4A8', '#DDA4A8'],
  GOLD: ['#FCC965', '#F7BA56', '#F3AC4A', '#EE9F3D', '#EA9130', '#EA9130'],
  EVEREST: ['#017B88', '#30A0A4', '#90B7B4', '#AECEBF', '#DEDDBE', '#D9B28B', '#D9B28B'],
  RED: ['#FFBABA', '#FF7B7B', '#FF5252', '#FF0000', '#A70000', '#900000', '#900000']
}
