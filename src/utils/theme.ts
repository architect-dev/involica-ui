import { SummitPalette } from 'config/constants/types'
import { elevationPalette } from 'theme/colors'

export const getPaletteGradientColors = (summitPalette: string | null): string[] => {
  return elevationPalette[summitPalette || SummitPalette.BASE]
}

export const getPaletteGradientStops = (summitPalette: string | null, asPx?: boolean): string[] => {
  const colors = getPaletteGradientColors(summitPalette)

  const pxOrPerc = asPx === true ? 'px' : '%'

  if (summitPalette === 'PROFILE') {
    return [
      '#154463',
      '#017B88',
      '#90B7B4',
    ]
  }

  if (summitPalette === 'EXPEDITION') {
    return [
      `${colors[0]} 20${pxOrPerc}`,
      // `${colors[1]} 21${pxOrPerc}`,
      `${colors[1]} 35${pxOrPerc}`,
      // `${colors[2]} 36${pxOrPerc}`,
      `${colors[2]} 50${pxOrPerc}`,
      // `${colors[3]} 51${pxOrPerc}`,
      `${colors[3]} 65${pxOrPerc}`,
      // `${colors[4]} 66${pxOrPerc}`,
      `${colors[4]} 80${pxOrPerc}`,
      // `${colors[5]} 81${pxOrPerc}`,
      `${colors[4]} 100${pxOrPerc}`,
    ]
  }

  return [
    `${colors[0]} 20${pxOrPerc}`,
    `${colors[1]} 21${pxOrPerc}`,
    `${colors[1]} 35${pxOrPerc}`,
    `${colors[2]} 36${pxOrPerc}`,
    `${colors[2]} 50${pxOrPerc}`,
    `${colors[3]} 51${pxOrPerc}`,
    `${colors[3]} 65${pxOrPerc}`,
    `${colors[4]} 66${pxOrPerc}`,
    `${colors[4]} 80${pxOrPerc}`,
    `${colors[5]} 81${pxOrPerc}`,
  ]
}

export const getPaletteGradientFarmCardBackground = (elevation: string | null): string => {
  const colors = getPaletteGradientColors(elevation)
  return `
    linear-gradient(
        135deg,
        ${colors[0]} 0%,
        ${colors[1]} 20%,
        ${colors[2]} 35%,
        ${colors[3]} 50%,
        ${colors[4]} 65%,
        ${colors[5]} 80%,
        ${colors[5]} 100%
    );
    `
}

export const getChainLinearGradient = (chain) => {
  if (chain === 250) return ['#4bb5f9', '#0d4eae']
  if (chain === 137) return ['#945DF0', '#7936EB']
  return ['orange']
}
export const getChainSolidColor = (chain) => {
  if (chain === 250) return '#3098f2'
  if (chain === 137) return '#8247E5'
  return 'orange'
}
