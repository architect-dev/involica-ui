import BigNumber from 'bignumber.js'

export const NamedChainId = {
  FTM: '250',
  BSC_TESTNET: '97',
  BSC: '56',
  POLYGON: '137',
}

export enum IntroStep {
  NotStarted,
  TokenIn,
  Amount,
  Outs,
  Interval,
  Approve,
  Treasury,
  Finalize,
}

export type AddressRecord<T> = Record<string, T>

// ECOSYSTEM
export interface Ecosystem {
  account?: string
  isDark: boolean
  connectModalOpen: boolean
}
interface EcosystemMutators {
  setActiveAccount: (string) => void
  clearActiveAccount: () => void
  setIsDark: (boolean) => void
  setConnectModalOpen: (boolean) => void
}

// PUBLIC DATA
export interface Token {
  symbol: string
  address: string
  price: number
  decimals: number
}
export interface PublicData {
  tokens: AddressRecord<Token>
  nativeToken: Token
}
interface PublicDataMutators {
  fetchPublicData: () => Promise<void>
}

// USER DATA
export interface PositionOut {
  token: string
  weight: number
  maxSlippage: number
}
export interface Position extends PositionConfig {
  user: string
  tokenIn: string
  outs: PositionOut[]
  amountDCA: string
  intervalDCA: number
  lastDCA: number
  maxGasPrice: MaxGasPriceOptions
  taskId: string
  finalizationReason: string
  paused: boolean
}
export interface UserTokenData {
  address: string
  allowance: BigNumber
  balance: BigNumber
}
export interface UserTx {
  timestamp: number
  tokenIn: string
  txFee: BigNumber
  tokenTxs: UserTokenTx[]
}
export interface UserTokenTx {
  tokenIn: string
  tokenInPrice: BigNumber
  tokenOut: string
  amountIn: BigNumber
  amountOut: BigNumber
  err: string
}
export interface UserData {
  userHasPosition: boolean
  userTreasury: BigNumber
  position: Position
  allowance: BigNumber
  balance: BigNumber
  dcasRemaining: number
  userTokensData: AddressRecord<UserTokenData>
  userNativeTokenData: UserTokenData
  userTxs: UserTx[]
}
interface UserDataState {
  userData?: UserData
}
interface UserDataMutators {
  fetchUserData: (account: string, hydrateConfig: boolean) => Promise<void>
}

interface Loaded {
  userDataLoaded: boolean
  publicDataLoaded: boolean
}

// POSITION CONFIG
export type MaxGasPriceOptions = '100' | '200' | '500'
export interface PositionConfig {
  tokenIn?: string
  outs: PositionOut[]
  amountDCA?: string
  intervalDCA?: number
  maxGasPrice?: MaxGasPriceOptions
  executeImmediately?: boolean
}
export interface PositionConfigSupplements {
  startIntro: boolean
  amountDCAInvalidReason: string | null
  fundingAmount: string | null
  fundingInvalidReason: string | null
  dcasCount: string
  dcasCountInvalidReason: string | null
  weeks: string
  weeksInvalidReason: string | null
  days: string
  daysInvalidReason: string | null
  hours: string
  hoursInvalidReason: string | null
}
export interface PositionConfigMutators {
  getStarted: () => void
  setTokenIn: (tokenIn: string) => void
  setOuts: (outs: PositionOut[]) => void
  addOut: (token: string, weight: number, maxSlippage: number) => void
  removeOut: (token: string) => void
  updateWeights: (weights: number[]) => void
  updateOutMaxSlippage: (token: string, maxSlippage: number) => void
  setAmountDCA: (amountDCA: string, fullBalance: string | null, token: Token) => void
  setFundingAmount: (fundingAmount: string, fullBalance: string | null) => void
  setMaxGasPrice: (maxGasPrice: MaxGasPriceOptions) => void
  setDcasCount: (dcasCount: string) => void
  setWeeks: (weeks: string) => void
  setDays: (days: string) => void
  setHours: (hours: string) => void
  setIntervalDCA: (intervalDCA: number) => void
}

// DEBUG
export interface DebugMutators {
  hydrateConfig: () => void
  resetConfig: () => void
}

// Global state
interface ConfigState {
  config: PositionConfig & PositionConfigSupplements
}
export interface State
  extends Ecosystem,
    EcosystemMutators,
    PublicData,
    PublicDataMutators,
    UserDataState,
    UserDataMutators,
    Loaded,
    ConfigState,
    PositionConfigMutators,
    DebugMutators {}
