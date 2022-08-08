import { TokenSymbol } from 'config/constants/tokenSymbols'
import { MultiElevAllocationConfig } from '../../types'

const baseElevations = {
  OASIS: { live: true, exists: true, },
  PLAINS: { live: true, exists: true, },
  MESA: { live: true, exists: true, },
  SUMMIT: { live: true, exists: true, },
}

export const farmConfigs: { [key: string]: MultiElevAllocationConfig } = {
  [TokenSymbol.SUMMIT]: {
    allocation: 1500,
    taxBP: 700,
    depositFeeBP: 100,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.EVEREST]: {
    allocation: 2000,
    taxBP: 0,
    depositFeeBP: 0,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.CAKE]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BIFI]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.USDC]: {
    allocation: 100,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.GS0]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.GS1]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: {
      OASIS: { live: true, exists: true, comment: 'Test Oasis Comment' },
      PLAINS: { live: true, exists: true, },
      MESA: { live: true, exists: true, },
      SUMMIT: { live: true, exists: true, },
    },
  },
  [TokenSymbol.GS2]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: {
      OASIS: { live: true, exists: true, warning: 'Test Oasis Warning' },
      PLAINS: { live: true, exists: true, },
      MESA: { live: true, exists: true, },
      SUMMIT: { live: true, exists: true, },
    },
  },
  [TokenSymbol.GS3]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.GS4]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.GS5]: {
    allocation: 50,
    taxBP: 700,
    depositFeeBP: 100,
    native: false,
    elevations: baseElevations,
  },
}
