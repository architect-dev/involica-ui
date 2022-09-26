import BigNumber from 'bignumber.js'
import { cloneDeep } from 'lodash'
import { useMemo } from 'react'
import { bn, bnDecOffset, bnZero } from 'utils'
import { timestampToDateTime } from 'utils/timestamp'
import { useConfigurableIntervalDCA, useUserTxs } from './hooks'
import { getValueChangeStatus, ValueChangeStatus } from './status'
import { useInvolicaStore } from './store'
import { AddressRecord, Token, UserTokenTx } from './types'

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
export const useUserTxsWithDisplayData = () => {
  const userTxs = useUserTxs()
  const tokensData = useInvolicaStore((state) => state.tokens)

  const txs = useMemo(() => {
    return userTxs.map(
      ({ timestamp, tokenIn, tokenTxs }): UserTxWithTradeData => {
        const tokenInDecimals = tokensData?.[tokenIn]?.decimals
        const tokenInTradePrice = bn(tokenTxs[0].tokenInPrice).toNumber()
        const tokenInCurrentPrice = tokensData?.[tokenIn]?.price
        const totalTokenInTradeAmount = tokenTxs.reduce((acc, { amountIn }) => acc.plus(amountIn), bnZero)

        const totalTokenInTradeAmountUsd = bnDecOffset(totalTokenInTradeAmount, tokenInDecimals)
          .times(tokenInTradePrice)
          .toNumber()
        const totalTokenInCurrentAmountUsd = bnDecOffset(totalTokenInTradeAmount, tokenInDecimals)
          .times(tokenInCurrentPrice)
          .toNumber()

        const tokenInValueChangeUsd = totalTokenInCurrentAmountUsd - totalTokenInTradeAmountUsd
        const tokenInValueChangePerc = (tokenInValueChangeUsd * 100) / totalTokenInTradeAmountUsd

        const tokenInData: TokenWithTradeData = {
          ...tokensData[tokenIn],

          tradeAmount: totalTokenInTradeAmount,

          tradePrice: tokenInTradePrice,
          tradeAmountUsd: totalTokenInTradeAmountUsd,
          tradeAmountUsdDisplay: totalTokenInTradeAmountUsd == null ? '-' : `$${totalTokenInTradeAmountUsd.toFixed(2)}`,

          currentPrice: tokenInCurrentPrice,
          currentAmountUsd: totalTokenInCurrentAmountUsd,
          currentAmountUsdDisplay:
            totalTokenInCurrentAmountUsd == null ? '-' : `$${totalTokenInCurrentAmountUsd.toFixed(2)}`,

          valueChangeUsd: tokenInValueChangeUsd,
          valueChangeUsdDisplay: tokenInValueChangeUsd == null ? '-' : `$${Math.abs(tokenInValueChangeUsd).toFixed(2)}`,
          valueChangePerc: tokenInValueChangePerc,
          valueChangePercDisplay:
            tokenInValueChangePerc == null ? '-' : `${Math.abs(tokenInValueChangePerc).toFixed(2)}%`,
          valueChangeStatus: getValueChangeStatus(tokenInValueChangePerc),
        }

        const tokenTxsData = tokenTxs.map(
          (tokenTx): UserTokenTxWithTradeData => {
            const tradeAmount = tokenTx.amountOut
            const outDecimals = tokensData?.[tokenTx.tokenOut]?.decimals
            const amountOutDecOffset = bnDecOffset(tokenTx.amountOut, outDecimals)

            const tradePrice =
              tokenInData?.decimals == null || outDecimals == null
                ? null
                : bnDecOffset(tokenTx.amountIn, tokenInData.decimals)
                    .div(amountOutDecOffset)
                    .times(tokenTx.tokenInPrice)
                    .toNumber()
            const tradeAmountUsd =
              tradePrice == null || outDecimals == null ? null : amountOutDecOffset.times(tradePrice).toNumber()

            const currentPrice = tokensData?.[tokenTx.tokenOut]?.price
            const currentAmountUsd =
              currentPrice == null || outDecimals == null ? null : amountOutDecOffset.times(currentPrice).toNumber()

            const valueChangeUsd = currentAmountUsd - tradeAmountUsd
            const valueChangePerc = (valueChangeUsd * 100) / tradeAmountUsd

            return {
              ...tokenTx,
              ...tokensData[tokenTx.tokenOut],

              tradeAmount,

              tradePrice,
              tradeAmountUsd,
              tradeAmountUsdDisplay: tradeAmountUsd == null ? '-' : `$${tradeAmountUsd.toFixed(2)}`,

              currentPrice,
              currentAmountUsd,
              currentAmountUsdDisplay: currentAmountUsd == null ? '-' : `$${currentAmountUsd.toFixed(2)}`,

              valueChangeUsd,
              valueChangeUsdDisplay: valueChangeUsd == null ? '-' : `$${Math.abs(valueChangeUsd).toFixed(2)}`,
              valueChangePerc,
              valueChangePercDisplay: valueChangePerc == null ? '-' : `${Math.abs(valueChangePerc).toFixed(2)}%`,
              valueChangeStatus: getValueChangeStatus(valueChangePerc),
            }
          },
        )

        const outValueChangeUsd = tokenTxsData.reduce((acc, tokenTx) => acc + tokenTx.valueChangeUsd, 0)

        const valueChangeUsd = outValueChangeUsd - tokenInData.valueChangeUsd
        const valueChangePerc = (valueChangeUsd * 100) / tokenInData.tradeAmountUsd

        return {
          timestamp,
          timestampDisplay: timestampToDateTime(timestamp),
          tokenInData,
          tokenTxsData,
          valueChangeUsd,
          valueChangeUsdDisplay: valueChangeUsd == null ? '-' : `$${Math.abs(valueChangeUsd).toFixed(2)}`,
          valueChangePerc,
          valueChangePercDisplay: valueChangePerc == null ? '-' : `${Math.abs(valueChangePerc).toFixed(2)}%`,
          valueChangeStatus: getValueChangeStatus(valueChangePerc),
        }
      },
    )
  }, [userTxs, tokensData])

  const derived = useMemo((): DerivedTxsStats => {
    let totalValueChangeUsd = 0
    let totalTradeInAmountUsd = 0
    let totalCurrentInAmountUsd = 0
    let totalTradeOutAmountUsd = 0
    let totalCurrentOutAmountUsd = 0
    const inTokens: AddressRecord<TokenWithTradeData> = {}
    const outTokens: AddressRecord<TokenWithTradeData> = {}

    txs.forEach((tx) => {
      totalValueChangeUsd += tx.valueChangeUsd
      totalTradeInAmountUsd += tx.tokenInData.tradeAmountUsd
      totalCurrentInAmountUsd += tx.tokenInData.currentAmountUsd

      if (inTokens[tx.tokenInData.address] == null) {
        inTokens[tx.tokenInData.address] = cloneDeep(tx.tokenInData)
      } else {
        inTokens[tx.tokenInData.address].tradeAmountUsd += tx.tokenInData.tradeAmountUsd
        inTokens[tx.tokenInData.address].currentAmountUsd += tx.tokenInData.currentAmountUsd
      }

      tx.tokenTxsData.forEach((tokenTx) => {
        totalTradeOutAmountUsd += tokenTx.tradeAmountUsd
        totalCurrentOutAmountUsd += tokenTx.currentAmountUsd

        if (outTokens[tokenTx.address] == null) {
          outTokens[tokenTx.address] = cloneDeep(tokenTx)
        } else {
          outTokens[tokenTx.address].tradeAmountUsd += tokenTx.tradeAmountUsd
          outTokens[tokenTx.address].currentAmountUsd += tokenTx.currentAmountUsd
        }
      })
    })

    const totalValueChangeUsdDisplay =
      totalValueChangeUsd == null ? '-' : `$${Math.abs(totalValueChangeUsd).toFixed(2)}`
    const totalValueChangePerc = (totalValueChangeUsd * 100) / totalTradeInAmountUsd
    const totalValueChangePercDisplay =
      totalValueChangePerc == null ? '-' : `${Math.abs(totalValueChangePerc).toFixed(2)}%`
    const totalValueChangeStatus = getValueChangeStatus(totalValueChangePerc)

    Object.values(inTokens).forEach((inToken) => {
      inTokens[inToken.address].tradeAmountUsdDisplay =
        inToken.tradeAmountUsd == null ? '-' : `$${Math.abs(inToken.tradeAmountUsd).toFixed(2)}`
      inTokens[inToken.address].currentAmountUsdDisplay =
        inToken.currentAmountUsd == null ? '-' : `$${Math.abs(inToken.currentAmountUsd).toFixed(2)}`

      const valueChangeUsd = inToken.currentAmountUsd - inToken.tradeAmountUsd
      const valueChangePerc = (inToken.valueChangeUsd * 100) / inToken.tradeAmountUsd
      inTokens[inToken.address].valueChangeUsd = valueChangeUsd
      inTokens[inToken.address].valueChangeUsdDisplay =
        valueChangeUsd == null ? '-' : `$${Math.abs(valueChangeUsd).toFixed(2)}`
      inTokens[inToken.address].valueChangePerc = valueChangePerc
      inTokens[inToken.address].valueChangePercDisplay =
        valueChangePerc == null ? '-' : `${Math.abs(valueChangePerc).toFixed(2)}%`
      inTokens[inToken.address].valueChangeStatus = getValueChangeStatus(inToken.valueChangePerc)
    })
    Object.values(outTokens).forEach((outToken) => {
      outTokens[outToken.address].tradeAmountUsdDisplay =
        outToken.tradeAmountUsd == null ? '-' : `$${Math.abs(outToken.tradeAmountUsd).toFixed(2)}`
      outTokens[outToken.address].currentAmountUsdDisplay =
        outToken.currentAmountUsd == null ? '-' : `$${Math.abs(outToken.currentAmountUsd).toFixed(2)}`

      const valueChangeUsd = outToken.currentAmountUsd - outToken.tradeAmountUsd
      const valueChangePerc = (outToken.valueChangeUsd * 100) / outToken.tradeAmountUsd
      outTokens[outToken.address].valueChangeUsd = valueChangeUsd
      outTokens[outToken.address].valueChangeUsdDisplay =
        valueChangeUsd == null ? '-' : `$${Math.abs(valueChangeUsd).toFixed(2)}`
      outTokens[outToken.address].valueChangePerc = valueChangePerc
      outTokens[outToken.address].valueChangePercDisplay =
        valueChangePerc == null ? '-' : `${Math.abs(valueChangePerc).toFixed(2)}%`
      outTokens[outToken.address].valueChangeStatus = getValueChangeStatus(outToken.valueChangePerc)
    })

    return {
      totalTradeInAmountUsd,
      totalTradeInAmountUsdDisplay:
        totalTradeInAmountUsd == null ? '-' : `$${Math.abs(totalTradeInAmountUsd).toFixed(2)}`,
      totalCurrentInAmountUsd,
      totalCurrentInAmountUsdDisplay:
        totalCurrentInAmountUsd == null ? '-' : `$${Math.abs(totalCurrentInAmountUsd).toFixed(2)}`,
      totalInStatus: getValueChangeStatus(((totalCurrentInAmountUsd - totalTradeInAmountUsd) * 100) / totalTradeInAmountUsd),

      totalTradeOutAmountUsd,
      totalTradeOutAmountUsdDisplay:
        totalTradeOutAmountUsd == null ? '-' : `$${Math.abs(totalTradeOutAmountUsd).toFixed(2)}`,
      totalCurrentOutAmountUsd,
      totalCurrentOutAmountUsdDisplay:
        totalCurrentOutAmountUsd == null ? '-' : `$${Math.abs(totalCurrentOutAmountUsd).toFixed(2)}`,
      totalOutStatus: getValueChangeStatus(((totalCurrentOutAmountUsd - totalCurrentInAmountUsd) * 100) / totalTradeOutAmountUsd),

      totalValueChangeUsd,
      totalValueChangeUsdDisplay,
      totalValueChangePerc,
      totalValueChangePercDisplay,
      totalValueChangeStatus,

      inTokens,
      outTokens,
    }
  }, [txs])

  return {
    txs,
    derived,
  }
}
