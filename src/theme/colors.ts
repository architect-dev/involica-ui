import { Colors } from './types'

const quartz = '#F7CAC9'

export const baseColors = {
  failure: '#cc0000',
  primary: '#adadad',
  primaryBright: '#588cff',
  primaryDark: '#2559cc',
  secondary: '#40c2e9',
  success: '#198754',
  warning: '#FFB237',
}

export const brandColors = {
  quartz,
}

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: '#fff6eb',
  cardHover: 'white',
  backgroundDisabled: '#fff6eb',
  contrast: '#191326',
  invertedContrast: '#FFFFFF',
  input: '#eeeaf4',
  inputSecondary: '#46557d',
  tertiary: '#EFF4F5',
  text: '#575757',
  textShadow: 'rgba(87, 87, 87, 0.75)',
  textDisabled: '#828b93',
  textSubtle: '#46557d',
  buttonText: '#faf1e4',
  borderColor: '#98a3ac',
  card: '#FFFFFF',
  selectorBackground: '#cacaca',
  button: '#adadad',
  warning: '#d78400',
  shadow: 'rgba(0, 0, 0, 0.25)',
}

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  secondary: '#40c2e9',
  background: '#222222',
  cardHover: '#1e2237',
  backgroundDisabled: '#57585c',
  contrast: '#FFFFFF',
  invertedContrast: '#191326',
  input: '#FFFFFF',
  inputSecondary: '#9a9a9d',
  primaryDark: '#0098A1',
  tertiary: '#45464A',
  text: '#faf1e4',
  textShadow: 'rgba(0, 0, 0, 0.5)',
  textDisabled: '#37383b',
  textSubtle: '#FFFFFF',
  buttonText: '#575757',
  borderColor: '#ebf2fd',
  card: '#0F152A',
  selectorBackground: '#41495f',
  button: '#adadad', // TODO: Update to dark mode color
  shadow: 'rgba(0, 0, 0, 0.25)',
}
