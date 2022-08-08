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
    allocation: 700,
    taxBP: 700,
    depositFeeBP: 0,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.EVEREST]: {
    allocation: 900,
    taxBP: 0,
    depositFeeBP: 0,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.TOMB_FTM]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.TSHARE_FTM]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.FTM_BOO]: {
    allocation: 100,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BPT_BEETS_FTM]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.FANTOM_OF_THE_OPERA]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.GRAND_ORCH]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BOO]: {
    allocation: 300,
    taxBP: 50,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BATTLE_OF_THE_BANDS]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol['2SHARES_FTM']]: {
    allocation: 0,
    taxBP: 50,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
    warning: '2omb has migrated from SpookySwap to TombSwap, as a result our farms for that LP must be retired'
  },
  [TokenSymbol['2OMB_FTM']]: {
    allocation: 0,
    taxBP: 50,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
    warning: '2omb has migrated from SpookySwap to TombSwap, as a result our farms for that LP must be retired'
  },
  [TokenSymbol.PAE_FTM]: {
    allocation: 800,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.pFTM_FTM]: {
    allocation: 800,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BOO_XBOO]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations
  },
  [TokenSymbol.USDC_MIM]: {
    allocation: 100,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations
  },
  [TokenSymbol.FTM_BSHARE]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.TOMB_BASED]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.LQDR_FTM]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.TOMB_MAI]: {
    allocation: 200,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BASED_MAI]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 0,
    native: false,
    elevations: baseElevations,
  },
}
