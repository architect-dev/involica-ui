import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const spookyswapClient = new ApolloClient({
  uri: 'https://api.fura.org/subgraphs/name/spookyswap',
  cache: new InMemoryCache(),
})
export const involicaClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/architect-dev/involica',
  cache: new InMemoryCache(),
})

export interface InvolicaStats {
  totalDcasCount: number
  totalManualDcasCount: number
  totalInvolicaTxFee: string[]
  totalTradeAmountUsd: string

  inTokens: string[]
  inAmounts: string[]

  outTokens: string[]
  outAmounts: string[]
}
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const transformInvolicaStats = ({ id, __typename, ...involicaStats }) => {
  return involicaStats as InvolicaStats
}

export interface TimestampInsOuts {
  timestamp: number

  inToken: string
  inAmount: string

  outTokens: string[]
  outAmounts: string[]
}
export interface InvolicaDCA extends TimestampInsOuts {
  txHash: string

  user: string
  recipient: string
  involicaTxFee: string
  manualExecution: boolean

  dcasCount: number
  manualDcasCount: number
  totalInvolicaTxFee: string

  portfolioInTokens: string[]
  portfolioInAmounts: string[]
  portfolioOutTokens: string[]
  portfolioOutAmounts: string[]
}
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const transformInvolicaDCA = ({ id, timestamp, __typename, ...dca }) => {
  return {
    txHash: id,
    timestamp: parseInt(timestamp),
    ...dca,
  } as InvolicaDCA
}

export type InvolicaSnapshot = TimestampInsOuts
export const transformInvolicaSnapshot = ({ id, __typename, ...snapshot }) => {
  return {
    timestamp: parseInt(id),
    ...snapshot,
  } as InvolicaSnapshot
}

export const BLOCK_PRICES = gql`
  query pricesCurrent($tokens: [Bytes]!, $blockNum: Int!) {
    bundle(id: "1", block: { number: $blockNum }) {
      ethPrice
    }
    tokens(where: { id_in: $tokens }, block: { number: $blockNum }) {
      id
      derivedETH
    }
  }
`

export const DAY_TOKEN_DATA = gql`
  query pricesCurrent($tokens: [Bytes]!, $timestamp: Int!) {
    tokenDayDatas(orderBy: date, orderDirection: asc, where: { date_gte: $timestamp, token_in: $tokens }, first: 1000) {
      priceUSD
      date
      id
    }
  }
`

export const INVOLICA_STATS_DATA = gql`
  query InvolicaStatsData {
    involica(id: "1") {
      id
      inAmounts
      outAmounts
      inTokens
      outTokens
      totalDcasCount
      totalInvolicaTxFeeUsd
      totalManualDcasCount
      totalTradeAmountUsd
    }
  }
`

export const SNAPSHOTS_DATA = gql`
  query SnapshotsData {
    involicaSnapshots(first: 1000) {
      id
      inTokens
      inAmounts
      outTokens
      outAmounts
    }
  }
`

export const USER_STATS_DATA = gql`
  query UserStatsData($user: Bytes!) {
    dcas(where: { user: $user }, orderBy: timestamp, orderDirection: asc) {
      id
      user
      inAmount
      inToken
      involicaTxFeeUsd
      manualDcasCount
      manualExecution
      outAmounts
      outTokens
      portfolioInAmounts
      portfolioInTokens
      portfolioOutAmounts
      portfolioOutTokens
      recipient
      timestamp
      totalInvolicaTxFeeUsd
      dcasCount
    }
  }
`
