import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { bn, bnDecOffset, bnZero } from 'utils'
import { timestampToDateTime } from 'utils/timestamp'
import { useConfigurableIntervalDCA, useUserTxs } from './hooks'
import { ValueChangeStatus } from './status'
import { useInvolicaStore } from './store'
import { Token, UserTokenTx } from './types'

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
export const useUserTxsWithDisplayData = () => {
  const userTxs = useUserTxs()
  const tokensData = useInvolicaStore((state) => state.tokens)

  return useMemo(() => {
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
        const tokenInValueChangePerc = tokenInValueChangeUsd * 100 / totalTokenInTradeAmountUsd

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
          valueChangeStatus: Math.abs(tokenInValueChangePerc) < 2 ? ValueChangeStatus.Neutral : tokenInValueChangePerc > 0 ? ValueChangeStatus.Positive : ValueChangeStatus.Negative,
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
              tradePrice == null || outDecimals == null
                ? null
                : amountOutDecOffset.times(tradePrice).toNumber()

            const currentPrice = tokensData?.[tokenTx.tokenOut]?.price
            const currentAmountUsd =
              currentPrice == null || outDecimals == null
                ? null
                : amountOutDecOffset.times(currentPrice).toNumber()

            const valueChangeUsd = currentAmountUsd - tradeAmountUsd
            const valueChangePerc = valueChangeUsd * 100 / tradeAmountUsd

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
              valueChangeStatus: Math.abs(valueChangePerc) < 2 ? ValueChangeStatus.Neutral : valueChangePerc > 0 ? ValueChangeStatus.Positive : ValueChangeStatus.Negative,
            }
          },
        )

        const outValueChangeUsd = tokenTxsData.reduce((acc, tokenTx) => acc + tokenTx.valueChangeUsd, 0)

        const valueChangeUsd = outValueChangeUsd - tokenInData.valueChangeUsd
        const valueChangePerc = valueChangeUsd * 100 / tokenInData.tradeAmountUsd

        return {
          timestamp,
          timestampDisplay: timestampToDateTime(timestamp),
          tokenInData,
          tokenTxsData,
          valueChangeUsd,
          valueChangeUsdDisplay: valueChangeUsd == null ? '-' : `$${Math.abs(valueChangeUsd).toFixed(2)}`,
          valueChangePerc,
          valueChangePercDisplay: valueChangePerc == null ? '-' : `${Math.abs(valueChangePerc).toFixed(2)}%`,
          valueChangeStatus: Math.abs(valueChangePerc) < 2 ? ValueChangeStatus.Neutral : valueChangePerc > 0 ? ValueChangeStatus.Positive : ValueChangeStatus.Negative,
        }
      },
    )
  }, [userTxs, tokensData])
}
