import BigNumber from 'bignumber.js'

export const NamedChainId = {
  FTM: '250',
  BSC_TESTNET: '97',
  BSC: '56',
  POLYGON: '137',
}

// ECOSYSTEM
export interface Ecosystem {
  account?: string
  isDark: boolean
}
interface EcosystemMutators {
  setActiveAccount: (string) => void
  clearActiveAccount: () => void
  setIsDark: (boolean) => void
}

// PUBLIC DATA
export interface Token {
  symbol: string
  address: string
  price: BigNumber
  decimals: number
}
export interface PublicData {
  tokens: Token[]
}
interface PublicDataMutators {
  fetchPublicData: () => Promise<void>
}

// USER DATA
export interface PositionOut {
  token: string
  weight: number
  route: string[]
  maxSlippage: number
}
export interface Position {
  user: string
  tokenIn: string
  outs: PositionOut
  amountDCA: BigNumber
  intervalDCA: number
  lastDCA: number
  maxGasPrice: number
  taskId: string
  finalizationReason: string
}
export interface UserTokenData {
  token: string
  allowance: BigNumber
  balance: BigNumber
}
export interface UserData {
  userHasPosition: boolean
  userTreasury: BigNumber
  position: Position
  allowance: BigNumber
  balance: BigNumber
  dcasRemaining: number
  userTokensData: UserTokenData[]
}
interface UserDataState {
  userData?: UserData
}
interface UserDataMutators {
  fetchUserData: (account) => Promise<void>
}

interface Loaded {
  userDataLoaded: boolean
  publicDataLoaded: boolean
}

// Global state
export interface State
  extends Ecosystem,
    EcosystemMutators,
    PublicData,
    PublicDataMutators,
    UserDataState,
    UserDataMutators,
    Loaded {}
