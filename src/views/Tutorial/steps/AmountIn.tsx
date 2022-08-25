import React, { useCallback, useMemo } from 'react'
import { Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { useInvolicaStore } from 'state/store'
import { bn, bnDisplay } from 'utils'
import { usePositionConfigState } from './introStore'
import { getSymbol } from 'config/tokens'

export const AmountIn: React.FC = () => {
  const tokenIn = usePositionConfigState((state) => state.tokenIn)
  const tokenInData = useInvolicaStore((state) => state.tokens?.[tokenIn])
  const outs = usePositionConfigState((state) => state.outs)
  const tokenInUserData = useInvolicaStore(
    (state) => state.userData?.userTokensData?.[tokenIn],
  )
  const amountDCA = usePositionConfigState((state) => state.amountDCA)
  const amountDCAInvalidReason = usePositionConfigState(
    (state) => state.amountDCAInvalidReason,
  )
  const setAmountDCA = usePositionConfigState((state) => state.setAmountDCA)

  const fullBalance = useMemo(
    () => bnDisplay(tokenInUserData?.balance, tokenInData?.decimals),
    [tokenInData?.decimals, tokenInUserData?.balance],
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAmountDCA(e.currentTarget.value, fullBalance)
    },
    [setAmountDCA, fullBalance],
  )

  const handleSelectMax = useCallback(() => {
    setAmountDCA(fullBalance, fullBalance)
  }, [setAmountDCA, fullBalance])

  const minOut = useMemo(() => {
    if (outs.length === 0) return null
    return outs.reduce(
      (minO, out) => (out.weight < minO.weight ? out : minO),
      outs[0],
    )
  }, [outs])
  const amountDcaUsd = useMemo(() => {
    if (
      tokenInData == null ||
      amountDCAInvalidReason != null ||
      isNaN(parseFloat(amountDCA))
    )
      return 0
    return bn(parseFloat(amountDCA)).times(tokenInData.price).toNumber()
  }, [tokenInData, amountDCAInvalidReason, amountDCA])

  return (
    <>
      <Text small italic>
        Set the amount of <b>{tokenInData?.symbol}</b> to use for DCA.
      </Text>
      <TokenInput
        symbol={tokenInData?.symbol}
        balanceText="Wallet Balance"
        onChange={handleChange}
        onSelectMax={handleSelectMax}
        value={amountDCA}
        max={fullBalance}
        invalid={amountDCAInvalidReason != null && amountDCA !== ''}
      />
      {amountDCAInvalidReason != null && (
        <Text red italic mt="-12px">
          {amountDCAInvalidReason}
        </Text>
      )}
      {minOut != null &&
        amountDCAInvalidReason == null &&
        Math.floor(amountDcaUsd * minOut.weight) / 100 < 0.1 && (
          <Text red italic mt="-12px">
            <b>
              At this amount, your swap for {getSymbol(minOut.token)} will be $
              {(Math.floor(amountDcaUsd * minOut.weight) / 100).toFixed(2)}
            </b>
            <br />
            Each swap in your position must be at least $0.10 usd.
            <br />
            Increase portfolio % {getSymbol(minOut.token)} or increase DCA
            amount.
          </Text>
        )}
      <br />
      <Text italic>
        DCA amount USD: ${amountDcaUsd === 0 ? '-' : amountDcaUsd}
      </Text>
    </>
  )
}
