/* eslint-disable no-loop-func */
import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import {
  DAY_TOKEN_DATA,
  involicaClient,
  InvolicaDCA,
  InvolicaSnapshot,
  InvolicaStats,
  INVOLICA_STATS_DATA,
  SNAPSHOTS_DATA,
  TimestampOutsTokensAmountsPrices,
  transformInvolicaDCA,
  transformInvolicaSnapshot,
  transformInvolicaStats,
  USER_STATS_DATA,
} from 'config/constants/graph'
import { clone } from 'lodash'
import { useMemo } from 'react'
import { useConfigurableIntervalDCA, useUserTxs } from './hooks'
import { AddressRecord } from './types'
import { useWeb3React } from '@web3-react/core'
import { useInvolicaStore } from './store'

export const suffix = (intervalDCA: number | null) => {
  if (intervalDCA == null) return '-'
  if (intervalDCA === 3600 * 24 * 28) return 'month'
  if (intervalDCA === 3600 * 24 * 14) return 'other week'
  if (intervalDCA === 3600 * 24 * 7) return 'week'
  if (intervalDCA === 3600 * 24 * 2) return 'other day'
  if (intervalDCA === 3600 * 24) return 'day'
  if (intervalDCA === 3600 * 2) return 'other hour'
  if (intervalDCA === 3600) return 'hour'
  if (intervalDCA % (3600 * 24 * 7) === 0) return `${intervalDCA / (3600 * 24 * 7)} weeks`
  if (intervalDCA % (3600 * 24) === 0) return `${intervalDCA / (3600 * 24)} days`
  if (intervalDCA % 3600 === 0) return `${intervalDCA / 3600} hours`
  return '-'
}

const suffixly = (intervalDCA: number | null) => {
  if (intervalDCA == null) return '-'
  if (intervalDCA === 3600 * 24 * 28) return 'monthly'
  if (intervalDCA === 3600 * 24 * 14) return 'every other week'
  if (intervalDCA === 3600 * 24 * 7) return 'weekly'
  if (intervalDCA === 3600 * 24 * 2) return 'every other day'
  if (intervalDCA === 3600 * 24) return 'daily'
  if (intervalDCA === 3600 * 2) return 'every other hour'
  if (intervalDCA === 3600) return 'hourly'
  if (intervalDCA % (3600 * 24 * 7) === 0) return `every ${intervalDCA / (3600 * 24 * 7)} weeks`
  if (intervalDCA % (3600 * 24) === 0) return `every ${intervalDCA / (3600 * 24)} days`
  if (intervalDCA % 3600 === 0) return `every ${intervalDCA / 3600} hours`
  return '-'
}

export const useIntervalStrings = () => {
  const { intervalDCA, weeksInvalidReason, daysInvalidReason, hoursInvalidReason } = useConfigurableIntervalDCA()
  const anyError = useMemo(() => {
    return weeksInvalidReason != null || daysInvalidReason != null || hoursInvalidReason != null
  }, [weeksInvalidReason, daysInvalidReason, hoursInvalidReason])
  return useMemo(
    () => ({
      anyError,
      intervalString: `DCA will execute every ${anyError ? '-' : suffix(intervalDCA)}`,
      intervalStringly: `Executes ${anyError ? '-' : suffixly(intervalDCA)}`,
    }),
    [anyError, intervalDCA],
  )
}

export const useDailyTokenPrices = () => {
  const txs = useUserTxs()
  const tokensData = useInvolicaStore((state) => state.tokens)

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
    const prices: Record<number | string, AddressRecord<string>> = {}

    data.tokenDayDatas.forEach(({ date, priceUSD, id }: { date: number; priceUSD: string; id: string }) => {
      const address = id.split('-')[0]
      if (prices[date] == null) prices[date] = {}
      prices[date][address] = priceUSD
    })
    
    prices.current = {}

    Object.values(tokensData).forEach((token) => {
      prices.current[token.address.toLowerCase()] = token.price.toString()
    })

    return prices
  }, [loading, error, data?.tokenDayDatas, tokensData])

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

export const useInvolicaDCAChartData = (dcas: boolean, selectedToken: string | null, includeDCAs: boolean) => {
  const dcasOrSnapshots = useInvolicaDcasOrSnapshots(dcas)
  const dailyPrices = useDailyTokenPrices()

  const userOuts = useMemo(() => {
    if (dcasOrSnapshots == null) return null
    const outs: AddressRecord<boolean> = {}
    dcasOrSnapshots.forEach((dcaOrSnapshot) => {
      dcaOrSnapshot.outTokens.forEach((outToken) => {
        outs[outToken] = true
      })
    })
    if (selectedToken != null)
      return outs[selectedToken.toLowerCase()] ? [selectedToken.toLowerCase()] : []
    return Object.keys(outs)
  }, [dcasOrSnapshots, selectedToken])

  const dataStartDay = useMemo(() => {
    if (dcasOrSnapshots == null || dcasOrSnapshots.length === 0) return null
    return Math.floor(dcasOrSnapshots[0].timestamp / 86400) * 86400
  }, [dcasOrSnapshots])

  /*
    Zip between days to create a portfolio snapshot of everything that happened during that day
    For each day snapshot:
      Calculate trade dollar value
      Use current price to determine value change of ins and outs
      Add outs change and subtract in change to get total change
  */
  return useMemo(() => {
    if (dataStartDay == null || userOuts == null || dcasOrSnapshots == null || dailyPrices == null)
      return null

    let runningTradeUsd = 0
    const timestamps = []
    const tradeValData = []
    const currentValData = []
    const dcasCountData = []
    let dayTimestamp = dataStartDay
    let dcaIndex = 0
    const runningPortfolioOuts: AddressRecord<number> = clone({})

    // Populate running portfolio with tokens to track
    userOuts.forEach((outToken) => {
      runningPortfolioOuts[outToken] = 0
    })

    while (dayTimestamp <= Math.floor(Date.now() / 1000) + 86400) {
      const yesterdayTimestamp = dayTimestamp - 86400
      let dcasCount = 0;

      // Increment portfolio values with all trades that happened on this day
      for (let i = dcaIndex; i < dcasOrSnapshots.length; i++) {
        const dcaOrSnapshot = dcasOrSnapshots[i]

        // Exit if dca didn't happen during this day
        if (dcaOrSnapshot.timestamp < yesterdayTimestamp || dcaOrSnapshot.timestamp >= dayTimestamp) break
        if (dcas) {
          dcasCount += 1
        } else {
          dcasCount += (dcaOrSnapshot as InvolicaSnapshot).dcasCount
        }

        dcaOrSnapshot.outTokens.forEach((outToken, outTokenIndex) => {
          const amount = dcasOrSnapshots[i].outAmounts[outTokenIndex]
          
          // Only include token if its being tracked
          if (runningPortfolioOuts[outToken] != null) {
            runningPortfolioOuts[outToken] += amount
            
            const tradePrice = dailyPrices[yesterdayTimestamp]?.[outToken] ?? '0'
            runningTradeUsd += parseFloat(tradePrice) * amount
          }
        })

        if (includeDCAs) {
          timestamps.push(dcaOrSnapshot.timestamp)
          tradeValData.push(runningTradeUsd)
          let currentUsd = 0
          Object.entries(runningPortfolioOuts).forEach(([token, amount]) => {
            const currentPrice = dailyPrices[yesterdayTimestamp]?.[token] ?? '0'
            currentUsd += parseFloat(currentPrice) * amount
          })
          currentValData.push(currentUsd)
        }

        dcaIndex++
      }
      
      timestamps.push(dayTimestamp)
      tradeValData.push(runningTradeUsd)

      const isCurrentDay = dayTimestamp > Math.floor(Date.now() / 1000)
      let currentUsd = 0
      Object.entries(runningPortfolioOuts).forEach(([token, amount]) => {
        const currentPrice = dailyPrices[isCurrentDay ? 'current' : yesterdayTimestamp]?.[token] ?? '0'
        currentUsd += parseFloat(currentPrice) * amount
      })

      currentValData.push(currentUsd)

      dcasCountData.push(dcas || dcasCount === 0 ? null : dcasCount)

      dayTimestamp += 86400
    }

    return {
      timestamps: timestamps.map((timestamp) => timestamp * 1000),
      tradeValData,
      currentValData,
      dcasCountData,
    }
  }, [dataStartDay, userOuts, dcasOrSnapshots, dailyPrices, dcas, includeDCAs])
}
