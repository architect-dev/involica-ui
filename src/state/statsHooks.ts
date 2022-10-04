/* eslint-disable no-loop-func */
import { useQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import {
  DAY_TOKEN_DATA,
  involicaClient,
  InvolicaDCA,
  InvolicaStats,
  INVOLICA_STATS_DATA,
  SNAPSHOTS_DATA,
  TimestampOutsTokensAmountsPrices,
  transformInvolicaDCA,
  transformInvolicaSnapshot,
  transformInvolicaStats,
  USER_STATS_DATA,
} from 'config/constants/graph'
import { useMemo } from 'react'
import { timestampToDateTime } from 'utils/timestamp'
import { useUserTxs } from './hooks'
import { getValueChangeStatusFromUsds, ValueChangeStatus } from './status'
import { useInvolicaStore } from './store'
import { AddressRecord, Token, UserTokenTx } from './types'
import { useWeb3React } from '@web3-react/core'

export interface TokenWithTradeData extends Token {
  tradeAmount: BigNumber

  tradePrice: number
  tradeAmountUsd: number
  tradeAmountUsdDisplay: string

  currentPrice: number
  currentAmountUsd: number
  currentAmountUsdDisplay: string

  valueChangeUsd: number
  valueChangeUsdDisplay: string
  valueChangePerc: number
  valueChangePercDisplay: string
  valueChangeStatus: ValueChangeStatus
}
export interface UserTokenTxWithTradeData extends UserTokenTx, TokenWithTradeData {}
export interface UserTxWithTradeData {
  timestamp: number
  timestampDisplay: string
  tokenInData: TokenWithTradeData
  tokenTxsData: UserTokenTxWithTradeData[]

  valueChangeUsd: number
  valueChangeUsdDisplay: string
  valueChangePerc: number
  valueChangePercDisplay: string
  valueChangeStatus: ValueChangeStatus
}

export interface DerivedTxsStats {
  totalTradeInAmountUsd: number
  totalTradeInAmountUsdDisplay: string
  totalCurrentInAmountUsd: number
  totalCurrentInAmountUsdDisplay: string
  totalInStatus: ValueChangeStatus

  totalTradeOutAmountUsd: number
  totalTradeOutAmountUsdDisplay: string
  totalCurrentOutAmountUsd: number
  totalCurrentOutAmountUsdDisplay: string
  totalOutStatus: ValueChangeStatus

  totalValueChangeUsd: number
  totalValueChangeUsdDisplay: string
  totalValueChangePerc: number
  totalValueChangePercDisplay: string
  totalValueChangeStatus: ValueChangeStatus
  inTokens: AddressRecord<TokenWithTradeData>
  outTokens: AddressRecord<TokenWithTradeData>
}

export interface UsdDisplay {
  usd: number
  usdDisplay: string
}
export interface PercDisplay {
  perc: number
  percDisplay: string
}
export interface PriceUsdDisplay extends UsdDisplay {
  price: number
}
export interface TradeAndCurrentAndStatus {
  trade: UsdDisplay
  current: UsdDisplay
  status: ValueChangeStatus
}
export interface ValueChangeAndStatus extends UsdDisplay, PercDisplay {
  status: ValueChangeStatus
}
export interface TokenTradeData extends Token {
  amount: number
  trade: PriceUsdDisplay
  current: PriceUsdDisplay
  valueChange: ValueChangeAndStatus
}
export interface LifetimeStats {
  inTokens: AddressRecord<TokenTradeData>
  outTokens: AddressRecord<TokenTradeData>

  totalInTrade: UsdDisplay
  totalOutFull: TradeAndCurrentAndStatus
  totalValueChange: ValueChangeAndStatus
}
export interface DCAStats {
  txHash: string

  timestamp: number
  timestampDisplay: string

  inToken: TokenTradeData
  outTokens: TokenTradeData[]

  totalValueChange: ValueChangeAndStatus
}

export const useDailyTokenPrices = () => {
  const txs = useUserTxs()
  const [inTokens, outTokens] = useMemo(() => {
    const ins: AddressRecord<boolean> = {}
    const outs: AddressRecord<boolean> = {}
    txs.forEach((tx) => {
      ins[tx.tokenIn] = true
      tx.tokenTxs.forEach((tokenTx) => {
        outs[tokenTx.tokenOut] = true
      })
    })
    return [
      Object.keys(ins).map((address) => address.toLowerCase()),
      Object.keys(outs).map((address) => address.toLowerCase()),
    ]
  }, [txs])

  const { loading, error, data } = useQuery(DAY_TOKEN_DATA, {
    variables: { tokens: inTokens.concat(outTokens), timestamp: 1663242332 },
  })

  const dayPrices = useMemo(() => {
    if (loading || error || data?.tokenDayDatas == null) return null
    const prices: Record<number, AddressRecord<string>> = {}

    data.tokenDayDatas.forEach(({ date, priceUSD, id }: { date: number; priceUSD: string; id: string }) => {
      const address = id.split('-')[0]
      if (prices[date] == null) prices[date] = {}
      prices[date][address] = priceUSD
    })

    return prices
  }, [loading, error, data])

  return dayPrices
}

export const useInvolicaStatsData = () => {
  const { loading, data } = useQuery(INVOLICA_STATS_DATA, {
    client: involicaClient,
  })

  return useMemo((): InvolicaStats | null => {
    if (loading) return null
    if (data?.involica == null) return null
    return transformInvolicaStats(data.involica)
  }, [loading, data])
}
export const useInvolicaSnapshotsData = () => {
  const { loading, data } = useQuery(SNAPSHOTS_DATA, {
    client: involicaClient,
  })

  return useMemo((): InvolicaDCA[] | null => {
    if (loading) return null
    if (data?.involicaSnapshots == null) return null
    return data.involicaSnapshots.map((snapshot) => transformInvolicaSnapshot(snapshot))
  }, [loading, data])
}
export const useInvolicaUserDcasData = () => {
  const { account } = useWeb3React()
  const { loading, data } = useQuery(USER_STATS_DATA, {
    variables: { user: account },
    client: involicaClient,
  })

  return useMemo((): InvolicaDCA[] | null => {
    if (loading) return null
    if (data?.dcas == null) return null
    return data.dcas.map((dca) => transformInvolicaDCA(dca))
  }, [loading, data])
}
export const useUserPortfolioOutTokens = () => {
  const userDcas = useInvolicaUserDcasData()
  return useMemo(() => {
    if (userDcas == null) return null
    const outs: AddressRecord<boolean> = {}
    userDcas.forEach((dca) => {
      dca.outTokens.forEach((outToken) => {
        outs[outToken] = true
      })
    })
    return Object.keys(outs).map((address) => ethers.utils.getAddress(address))
  }, [userDcas])
}

export const useInvolicaDcasOrSnapshots = (dcas: boolean) => {
  const userDcas = useInvolicaUserDcasData()
  const snapshots = useInvolicaSnapshotsData()

  return useMemo((): TimestampOutsTokensAmountsPrices[] => {
    return dcas ? userDcas : snapshots
  }, [dcas, userDcas, snapshots])
}

const displayifyUsd = (usd: number | null): string => {
  return usd == null ? '-' : `$${usd.toFixed(2)}`
}
const getUsdDisplay = (usd: number | null): UsdDisplay => {
  return {
    usd,
    usdDisplay: displayifyUsd(usd),
  }
}
const incrementUsdDisplay = (usd: number | null, current: UsdDisplay): UsdDisplay => {
  return getUsdDisplay(usd == null ? current.usd : current.usd + usd)
}
const getPriceUsdDisplay = (amount: number | null, price: number | null): PriceUsdDisplay => {
  return {
    price,
    ...getUsdDisplay(amount == null || price == null ? null : amount * price),
  }
}
const incrementPriceUsdDisplay = (
  amount: number | null,
  price: number | null,
  current: PriceUsdDisplay,
): PriceUsdDisplay => {
  if (current == null) return getPriceUsdDisplay(amount, price)

  const usd = amount == null || price == null ? null : amount * price
  if (usd == null) return current

  const currentAmount = current.usd / current.price
  const avgPrice = (current.usd + usd) / (currentAmount + amount)

  return {
    price: avgPrice,
    ...incrementUsdDisplay(usd, current),
  }
}

const displayifyPerc = (perc: number | null): string => {
  return perc == null ? '-' : `${perc.toFixed(2)}%`
}
const getPercDisplay = (currentUsd: number | null, tradeUsd: number | null): PercDisplay => {
  const perc = currentUsd == null || tradeUsd == null ? null : ((currentUsd - tradeUsd) / tradeUsd) * 100
  return {
    perc,
    percDisplay: displayifyPerc(perc),
  }
}

const getValueChangeAndStatus = (current: UsdDisplay, trade: UsdDisplay): ValueChangeAndStatus => {
  return {
    ...getUsdDisplay(current.usd - trade.usd),
    ...getPercDisplay(current.usd, trade.usd),
    status: getValueChangeStatusFromUsds(current.usd, trade.usd),
  }
}

const getFreshOrUpdatedTokenTradeData = (
  token: Token,
  amount: number,
  price: number,
  currentData: TokenTradeData | null,
): TokenTradeData => {
  if (currentData == null) {
    const trade = getPriceUsdDisplay(amount, price)
    const current = getPriceUsdDisplay(amount, token.price)
    return {
      ...token,

      amount,
      trade,
      current,
      valueChange: getValueChangeAndStatus(current, trade),
    }
  }

  const trade = incrementPriceUsdDisplay(amount, price, currentData.trade)
  const current = incrementPriceUsdDisplay(amount, token.price, currentData.current)
  return {
    ...currentData,

    amount: currentData.amount + amount,
    trade,
    current,
    valueChange: getValueChangeAndStatus(current, trade),
  }
}

const getValueChangeAndStatusFromUsds = (currentUsd: number | null, tradeUsd: number | null): ValueChangeAndStatus => {
  return {
    ...getUsdDisplay(currentUsd - tradeUsd),
    ...getPercDisplay(currentUsd, tradeUsd),
    status: getValueChangeStatusFromUsds(currentUsd, tradeUsd),
  }
}

export const useUserLifetimeStats = () => {
  const dcas = useInvolicaUserDcasData()
  const tokensData = useInvolicaStore((state) => state.tokens)

  return useMemo((): LifetimeStats | null => {
    if (dcas == null || tokensData == null) return null

    // Individual tokens performance
    const inTokens: AddressRecord<TokenTradeData> = {}
    const outTokens: AddressRecord<TokenTradeData> = {}

    dcas.forEach((dca) => {
      inTokens[dca.inToken] = getFreshOrUpdatedTokenTradeData(
        tokensData[ethers.utils.getAddress(dca.inToken)],
        dca.inAmount,
        dca.inPrice,
        inTokens[dca.inToken],
      )
      dca.outTokens.forEach((outToken, outIndex) => {
        outTokens[outToken] = getFreshOrUpdatedTokenTradeData(
          tokensData[ethers.utils.getAddress(outToken)],
          dca.outAmounts[outIndex],
          dca.outPrices[outIndex],
          outTokens[outToken],
        )
      })
    })

    const totalInTrade = getUsdDisplay(Object.values(inTokens).reduce((total, token) => total + token.trade.usd, 0))
    const totalOutTrade = getUsdDisplay(Object.values(outTokens).reduce((total, token) => total + token.trade.usd, 0))
    const totalOutCurrent = getUsdDisplay(
      Object.values(outTokens).reduce((total, token) => total + token.current.usd, 0),
    )
    const totalOutStatus = getValueChangeStatusFromUsds(totalOutCurrent.usd, totalOutTrade.usd)

    return {
      inTokens,
      outTokens,

      totalInTrade,
      totalOutFull: {
        trade: totalOutTrade,
        current: totalOutCurrent,
        status: totalOutStatus,
      },

      totalValueChange: getValueChangeAndStatusFromUsds(totalOutCurrent.usd, totalOutTrade.usd),
    }
  }, [dcas, tokensData])
}

export const useUserDcasData = () => {
  const dcas = useInvolicaUserDcasData()
  const tokensData = useInvolicaStore((state) => state.tokens)

  return useMemo((): DCAStats[] | null => {
    if (dcas == null || tokensData == null) return null

    return dcas.map(
      (dca): DCAStats => {
        const outTokens = dca.outTokens.map((outToken, outIndex) =>
          getFreshOrUpdatedTokenTradeData(
            tokensData[ethers.utils.getAddress(outToken)],
            dca.outAmounts[outIndex],
            dca.outPrices[outIndex],
            null,
          ),
        )
        return {
          txHash: dca.txHash,
          
          timestamp: dca.timestamp,
          timestampDisplay: timestampToDateTime(dca.timestamp),

          inToken: getFreshOrUpdatedTokenTradeData(
            tokensData[ethers.utils.getAddress(dca.inToken)],
            dca.inAmount,
            dca.inPrice,
            null,
          ),
          outTokens,

          totalValueChange: getValueChangeAndStatusFromUsds(
            outTokens.reduce((total, token) => total + token.current.usd, 0),
            outTokens.reduce((total, token) => total + token.trade.usd, 0),
          ),
        }
      },
    )
  }, [dcas, tokensData])
}
