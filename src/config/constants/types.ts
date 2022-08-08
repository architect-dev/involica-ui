import BigNumber from "bignumber.js"

/* eslint camelcase: 0 */
export const ForceElevationRetired = false
export const BetaFeatures = true

export const BN_ZERO = new BigNumber(0)
export const RoundLockTime = 120

export enum Elevation {
  OASIS = 'OASIS',
  PLAINS = 'PLAINS',
  MESA = 'MESA',
  SUMMIT = 'SUMMIT',
  EXPEDITION = 'EXPEDITION',
}

export enum SummitPalette {
  BASE = 'BASE',
  GOLD = 'GOLD',
  OASIS = 'OASIS',
  PLAINS = 'PLAINS',
  MESA = 'MESA',
  SUMMIT = 'SUMMIT',
  EXPEDITION = 'EXPEDITION',
  EVEREST = 'EVEREST',
}


export type ElevOrPalette = Elevation | SummitPalette

export const elevToPalette = (elevation?: Elevation): SummitPalette => {
  switch (elevation) {
    case Elevation.OASIS: return SummitPalette.OASIS
    case Elevation.PLAINS: return SummitPalette.PLAINS
    case Elevation.MESA: return SummitPalette.MESA
    case Elevation.SUMMIT: return SummitPalette.SUMMIT
    case Elevation.EXPEDITION: return SummitPalette.EXPEDITION
    default: return SummitPalette.BASE
  }
}

export const ZEROADD = '0x0000000000000000000000000000000000000000'

export const ElevationUnlockRound = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 1,
  [Elevation.MESA]: 1,
  [Elevation.SUMMIT]: 1,
  [Elevation.EXPEDITION]: 1,
}

export type PlainsTotemNumber = 0 | 1
export type MesaTotemNumber = 0 | 1 | 2 | 3 | 4
export type SummitTotemNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type ExpeditionTotemNumber = 0 | 1

export interface OasisElevationToNumber {
  [Elevation.OASIS]: number
  [Elevation.PLAINS]: number
  [Elevation.MESA]: number
  [Elevation.SUMMIT]: number
}

export const AllElevations = Object.values(Elevation).filter((v) => typeof v === 'string') as Elevation[]
export const ElevationTitle: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: 'THE OASIS',
  [Elevation.PLAINS]: 'THE PLAINS',
  [Elevation.MESA]: 'THE MESA',
  [Elevation.SUMMIT]: 'THE SUMMIT',
  [Elevation.EXPEDITION]: 'THE EXPEDITION',
}
export const ElevationHelpLink: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: 'https://docs.summitdefi.com/farming/oasis',
  [Elevation.PLAINS]: 'https://docs.summitdefi.com/farming/elevation',
  [Elevation.MESA]: 'https://docs.summitdefi.com/farming/elevation',
  [Elevation.SUMMIT]: 'https://docs.summitdefi.com/farming/elevation',
  [Elevation.EXPEDITION]: 'https://docs.summitdefi.com/expedition/overview',
}
export const ElevationMultiplier: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: '',
  [Elevation.PLAINS]: ': 2000M / 1.1x',
  [Elevation.MESA]: ': 5000M / 1.25x',
  [Elevation.SUMMIT]: ': 10000M / 1.5x',
  [Elevation.EXPEDITION]: 'EXPEDITION',
}
export const ElevationSubHeader: { [key in keyof typeof Elevation]: string } = {
  [Elevation.OASIS]: 'CONTINUOUS YIELD, 1X REWARDS',
  [Elevation.PLAINS]: '2 HOUR ROUNDS, 2X REWARDS',
  [Elevation.MESA]: '4 HOUR ROUNDS, 5X REWARDS',
  [Elevation.SUMMIT]: '8 HOUR ROUNDS, 10X REWARDS',
  [Elevation.EXPEDITION]:
    "An expedition starts every 2H in search of tokens and the cartographer predicts the elevation the party will make it to. Stake your SUMMIT either higher or lower than the cartographer's prediction, and win the staking rewards of the entire pool. Rewards are paid out in the expeditions search token (not SUMMIT), and vest over the duration of the next expedition.",
}

export const ElevationTotems: { [key in keyof typeof Elevation]: number[] } = {
  [Elevation.OASIS]: [0],
  [Elevation.PLAINS]: [0, 1],
  [Elevation.MESA]: [0, 1, 2, 3, 4],
  [Elevation.SUMMIT]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [Elevation.EXPEDITION]: [0, 1],
}
export const ElevationTotemCount: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 1,
  [Elevation.PLAINS]: 2,
  [Elevation.MESA]: 5,
  [Elevation.SUMMIT]: 10,
  [Elevation.EXPEDITION]: 2,
}
export const ElevationWinnersOffset: { [key in keyof typeof Elevation]: number[] } = {
  [Elevation.OASIS]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [Elevation.PLAINS]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [Elevation.MESA]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [Elevation.SUMMIT]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [Elevation.EXPEDITION]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
export const ElevationRoundOffset: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 0,
  [Elevation.MESA]: 0,
  [Elevation.SUMMIT]: 0,
  [Elevation.EXPEDITION]: 0,
}
export const ElevationPromoBanner: { [key in keyof typeof Elevation]: string | null } = {
  [Elevation.OASIS]: null,
  [Elevation.PLAINS]: null,
  [Elevation.MESA]: null,
  [Elevation.SUMMIT]: null,
  [Elevation.EXPEDITION]: null,
}
export const ElevationTotemNames: { [key in keyof typeof Elevation]: string[] } = {
  [Elevation.OASIS]: ['OTTER'],
  [Elevation.PLAINS]: ['TORTOISE', 'HARE'],
  [Elevation.MESA]: ['ZEBRA', 'FOX', 'OWL', 'CHEETAH', 'SCORPION'],
  [Elevation.SUMMIT]: [
    'RED PANDA',
    'BALD EAGLE',
    'ST BERNARD',
    'WOLF',
    'YETI',
    'FLAMINGO',
    'IBEX',
    'SNOW LEOPARD',
    'GORILLA',
    'ALPACA',
  ],
  [Elevation.EXPEDITION]: ['COSMIC BULL', 'COSMIC BEAR'],
}
export const ElevationInt: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 1,
  [Elevation.MESA]: 2,
  [Elevation.SUMMIT]: 3,
  [Elevation.EXPEDITION]: 4,
}
export const ElevationRoundDuration: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 3600 * 2,
  [Elevation.PLAINS]: 3600 * 2,
  [Elevation.MESA]: 3600 * 2,
  [Elevation.SUMMIT]: 3600 * 2,
  [Elevation.EXPEDITION]: 3600 * 24,
}
export const ElevationUnlockDuration: { [key in keyof typeof Elevation]: number } = {
  [Elevation.OASIS]: 0,
  [Elevation.PLAINS]: 3600 * 24 * 0,
  [Elevation.MESA]: 3600 * 24 * 1,
  [Elevation.SUMMIT]: 3600 * 24 * 2,
  [Elevation.EXPEDITION]: 3600 * 24 * 3,
}
export const elevationUtils = {
  all: [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT],
  allWithExpedition: [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT, Elevation.EXPEDITION],
  oasisElevation: [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT],
  elevationExpedition: [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT, Elevation.EXPEDITION],
  elevationOnly: [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT],
  isElevation: (elevation: string) => !!ElevationTitle[elevation],
  modalTitle: (elevation: string) => ElevationTitle[elevation as Elevation],
  elevationMultiplier: (elevation: Elevation) => ElevationMultiplier[elevation],
  header: (elevation: Elevation) => ElevationTitle[elevation],
  subHeader: (elevation: Elevation) => ElevationSubHeader[elevation],
  helpLink: (elevation: Elevation) => ElevationHelpLink[elevation],
  totemsArray: (elevation: Elevation) => ElevationTotems[elevation],
  getElevationTotemName: (elevation: Elevation, totem: number | null, asset = true) => {
    if (totem == null) return 'UNSELECTED'
    return ElevationTotemNames[elevation][totem].split(' ').join(asset ? '_' : ' ')
  },
  winningsOrEarnings: (elevation: Elevation) => {
    return elevation === Elevation.OASIS ? 'Earnings' : 'Winnings'
  },
  toInt: (elevation: Elevation) => ElevationInt[elevation] || 0,
  fromInt: (int): Elevation => {
    switch (int) {
      case 4:
        return Elevation.EXPEDITION
      case 3:
        return Elevation.SUMMIT
      case 2:
        return Elevation.MESA
      case 1:
        return Elevation.PLAINS
      default:
      case 0:
        return Elevation.OASIS
    }
  },
  elevationDataIndexToElevation: (int): Elevation => {
    switch (int) {
      case 3:
        return Elevation.EXPEDITION
      case 2:
        return Elevation.SUMMIT
      case 1:
        return Elevation.MESA
      default:
      case 0:
        return Elevation.PLAINS
    }
  },
  elevationToElevationDataIndex: (elevation: Elevation): number => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        return 3
      case Elevation.SUMMIT:
        return 2
      case Elevation.MESA:
        return 1
      default:
      case Elevation.PLAINS:
        return 0
    }
  },
  totemCount: (elevation: Elevation) => {
    return ElevationTotemCount[elevation]
  },
  getTotemIcon: (elevation: Elevation, totem: number) => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        if (totem === 0) return 'totemBull'
        return 'totemBear'
      case Elevation.SUMMIT:
        switch (totem) {
          case 0:
            return 'totem'
          case 1:
            return 'totem'
          case 2:
            return 'totem'
          case 3:
            return 'totem'
          case 4:
            return 'totem'
          case 5:
            return 'totem'
          case 6:
            return 'totem'
          case 7:
            return 'totem'
          case 8:
            return 'totem'
          default:
          case 9:
            return 'totem'
        }
      case Elevation.MESA:
        switch (totem) {
          case 0:
            return 'totem'
          case 1:
            return 'totem'
          case 2:
            return 'totem'
          case 3:
            return 'totem'
          default:
          case 4:
            return 'totem'
        }
      default:
      case Elevation.OASIS:
        if (totem === 0) return 'totemPEPE'
        return 'totemHare'
    }
  },
  backgroundColor: (elevation: Elevation, theme): string => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        return theme.colors.EXPEDITION
      case Elevation.SUMMIT:
        return theme.colors.SUMMIT
      case Elevation.MESA:
        return theme.colors.MESA
      case Elevation.PLAINS:
        return theme.colors.PLAINS
      case Elevation.OASIS:
        return theme.colors.OASIS
      default:
        return theme.colors.text
    }
  },
  unlockString: (elevation: Elevation): string => {
    switch (elevation) {
      case Elevation.EXPEDITION:
        return 'The Expedition begins on day 13'
      case Elevation.SUMMIT:
        return 'The Summit will unlock on day 5'
      case Elevation.MESA:
        return 'The Mesa will unlock on day 3'
      case Elevation.PLAINS:
        return 'The Plains will unlock at the next top of the hour following launch'
      default:
        return ''
    }
  },
  allocMultiplier: (elevation: Elevation): number => {
    switch (elevation) {
      case Elevation.SUMMIT:
        return 1.5
      case Elevation.MESA:
        return 1.25
      case Elevation.PLAINS:
        return 1.1
      default:
        return 1
    }
  },
}

export interface Address {
  56?: string // bsc
  97?: string // bsc testnet
  250?: string // ftm
  4002?: string // ftm testnet
}

export interface TokenWithWeight {
  token: string,
  weight: number,
}
export interface PriceableToken {
  symbol: string
  assetType: TokenAssetType
  lpSource?: TokenLpSource
  decimals: number
  tokenAddress?: string
  lpAddress?: string
  solidlyLpContainingTokens?: string[]
  balancerMultiPoolInfo?: {
    poolId: string,
    pricingTokens: TokenWithWeight[]
  }
}

export type PriceableTokenMap = { [key: string]: PriceableToken }

export enum TokenAssetType {
  Summit = 'Summit',
  Stablecoin = 'Stablecoin',
  Everest = 'Everest',
  SingleAsset = 'SingleAsset',
  LP = 'LP',
  WrappedNative = 'WrappedNative',
  Balancer2Pool = 'Balancer2Pool',
  BalancerMultiPool = 'BalancerMultiPool',
  SolidlyLP = 'SolidlyLP',
  CurveLP = 'CurveLP',
}

export enum TokenLpSource {
  BeethovenX = 'BeethovenX',
  SpookySwap = 'SpookySwap',
  SpiritSwap = 'SpiritSwap',
  SolidlyStable = 'Solidly (Stable)',
  SolidlyVolatile = 'Solidly (Volatile)',
  Quickswap = 'Quickswap',
  Curve = 'Curve',
  TombSwap = 'TombSwap',
}

export interface Token {
  symbol: string
  address?: Address
  decimals?: number
  projectLink?: string
}

export interface FarmElevationConfig {
  live: boolean
  exists: boolean
  comment?: string
  warning?: string
}

export interface FarmElevationsConfigs {
  [Elevation.OASIS]: FarmElevationConfig
  [Elevation.PLAINS]: FarmElevationConfig
  [Elevation.MESA]: FarmElevationConfig
  [Elevation.SUMMIT]: FarmElevationConfig
}

export interface MultiElevAllocationConfig {
  allocation: number
  depositFeeBP: number
  taxBP: number
  native: boolean
  comment?: string
  warning?: string
  elevations: FarmElevationsConfigs
}

export interface MultiElevFarmConfig extends MultiElevAllocationConfig, PriceableToken {
  name?: string
  passthroughStrategy?: string
  getUrl?: string
  beefyVaultApiName?: string
}

export interface FarmConfig extends MultiElevFarmConfig {
  farmToken: string
}

export interface RoadmapStrategy {
  name: string
  description?: string
  farming: {
      averageFarmLoyalty?: number
      [Elevation.OASIS]: {
          totem: number
          crowned?: boolean
          loyalty: number
          staked?: BigNumber
          perc: number
      },
      [Elevation.PLAINS]: {
          totem: number
          crowned?: boolean
          loyalty: number
          staked?: BigNumber
          perc: number
      },
      [Elevation.MESA]: {
          totem: number
          crowned?: boolean
          loyalty: number
          staked?: BigNumber
          perc: number
      },
      [Elevation.SUMMIT]: {
          totem: number
          crowned?: boolean
          loyalty: number
          staked?: BigNumber
          perc: number
      },
  },
  EVEREST: {
      summitLocked?: BigNumber
      glacierSummit?: BigNumber
      stakedSummit?: BigNumber
      lockedPerc: number
      lockDuration: number
  },
  [Elevation.EXPEDITION]: {
      deity: number
      crowned?: boolean
      deityLoyalty: number
      faith: number
  },
}


export enum RevertReasonOutput {
  Bad_withdrawal = 'Attempted_to_withdraw_zero,_or_more_than_you_have_staked.',
  Invalid_elev = 'Transaction_was_attempted_on_an_invalid_elevation',
  Pool_not_launched_yet = 'This_farm_hasn\'t_been_launched_yet',
  Elevation_locked = 'This_elevation_has_not_yet_unlocked',
  Cant_switch_totem_during_deposit = 'You_tried_to_make_a_deposit_with_a_different_totem',
  Invalid_totem = 'Transaction_was_attempted_on_an_invalid_totem',
  Elev_locked_until_rollover = 'The_Elevation_is_locked_until_the_round_is_rolled_over',
  Must_change_elev = 'You_can\'t_elevate_within_the_same_elevation',
  No_exped_elev_switch = 'This_token_cannot_be_elevated_into_the_Expedition',
  Transfer_non_zero_amount = 'Elevate_transactions_must_have_non_Zero_transfer_amounts',
  Bad_transfer = 'Elevate_transaction_had_invalid_parameters',
  Cant_switch_totem_during_elevate = 'You_can\'t_switch_your_totem_during_an_Elevate',
  Different_token = 'The_token_is_different_between_the_Source_and_Target_Farms',
  Totem_must_be_different = 'Totem_must_be_different',
}

export const RevertReasonMap = {
  Bad_withdrawal: RevertReasonOutput.Bad_withdrawal,
  Invalid_elev: RevertReasonOutput.Invalid_elev,
  Pool_not_launched_yet: RevertReasonOutput.Pool_not_launched_yet,
  Elevation_locked: RevertReasonOutput.Elevation_locked,
  Cant_switch_totem_during_deposit: RevertReasonOutput.Cant_switch_totem_during_deposit,
  Invalid_totem: RevertReasonOutput.Invalid_totem,
  Elev_locked_until_rollover: RevertReasonOutput.Elev_locked_until_rollover,
  Must_change_elev: RevertReasonOutput.Must_change_elev,
  No_exped_elev_switch: RevertReasonOutput.No_exped_elev_switch,
  Transfer_non_zero_amount: RevertReasonOutput.Transfer_non_zero_amount,
  Bad_transfer: RevertReasonOutput.Bad_transfer,
  Cant_switch_totem_during_elevate: RevertReasonOutput.Cant_switch_totem_during_elevate,
  Different_token: RevertReasonOutput.Different_token,
  Totem_must_be_different: RevertReasonOutput.Totem_must_be_different,
}

export const IsSummitRevertReason = {
  [RevertReasonOutput.Bad_withdrawal]: true,
  [RevertReasonOutput.Invalid_elev]: true,
  [RevertReasonOutput.Pool_not_launched_yet]: true,
  [RevertReasonOutput.Elevation_locked]: true,
  [RevertReasonOutput.Cant_switch_totem_during_deposit]: true,
  [RevertReasonOutput.Invalid_totem]: true,
  [RevertReasonOutput.Elev_locked_until_rollover]: true,
  [RevertReasonOutput.Must_change_elev]: true,
  [RevertReasonOutput.No_exped_elev_switch]: true,
  [RevertReasonOutput.Transfer_non_zero_amount]: true,
  [RevertReasonOutput.Bad_transfer]: true,
  [RevertReasonOutput.Cant_switch_totem_during_elevate]: true,
  [RevertReasonOutput.Different_token]: true,
  [RevertReasonOutput.Totem_must_be_different]: true,
}
