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
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 50,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.SUMMIT_MATIC]: {
    allocation: 1200,
    taxBP: 700,
    depositFeeBP: 50,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.EVEREST]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 50,
    native: true,
    elevations: baseElevations,
  },
  [TokenSymbol.MAI_USDC]: {
    allocation: 400,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.QI_MATIC]: {
    allocation: 700,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.BIFI_MAXI]: {
    allocation: 700,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.QUICK]: {
    allocation: 500,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.aTriCrypto]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.ETH_MATIC]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.MATIC_USDC]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
  [TokenSymbol.EURt_DAI_USDC_USDT]: {
    allocation: 300,
    taxBP: 700,
    depositFeeBP: 50,
    native: false,
    elevations: baseElevations,
  },
}
