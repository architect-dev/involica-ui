import React, { useMemo } from 'react'
import { Text } from 'uikit'
import { useConfigurableAmountDCA, usePositionOuts, usePositionTokenInWithData } from 'state/hooks'
import TokenAndAmountSelector from 'components/TokenAndAmountSelector'
import { getSymbol } from 'config/tokens'
import { bn } from 'utils'

export const AmountIn: React.FC = () => {
  const { tokenIn, tokenInData } = usePositionTokenInWithData()
  const { outs } = usePositionOuts()
  const { amountDCA, amountDCAInvalidReason, setAmountDCA } = useConfigurableAmountDCA()

  const minOut = useMemo(() => {
    if (outs.length === 0) return null
    return outs.reduce((minO, out) => (out.weight < minO.weight ? out : minO), outs[0])
  }, [outs])

  const amountDcaUsd = useMemo(() => {
    if (tokenInData?.price == null || amountDCAInvalidReason != null || isNaN(parseFloat(amountDCA))) return 0
    return bn(parseFloat(amountDCA)).times(tokenInData.price).toNumber()
  }, [tokenInData?.price, amountDCAInvalidReason, amountDCA])

  return (
    <>
      <Text small italic>
        Set the amount of <b>{tokenInData?.symbol}</b> to use for DCA.
      </Text>
      <TokenAndAmountSelector token={tokenIn} value={amountDCA} setValue={setAmountDCA} tokenSelectDisabled />
      {amountDCAInvalidReason != null && (
        <Text red italic mt="-12px">
          {amountDCAInvalidReason}
        </Text>
      )}
      {minOut != null && amountDCAInvalidReason == null && Math.floor(amountDcaUsd * minOut.weight) / 100 < 0.1 && (
        <Text color="warning" italic mt="-12px">
          <b>
            At this amount, your swap for {getSymbol(minOut.token)} will be $
            {(Math.floor(amountDcaUsd * minOut.weight) / 100).toFixed(2)}
          </b>
          <br />
          Each swap in your position is recommended to be {'>='} $0.10.
          <br />
          Increase portfolio % {getSymbol(minOut.token)} or increase DCA amount.
        </Text>
      )}
      <br />
      <Text italic>DCA amount USD: ${amountDcaUsd === 0 ? '-' : amountDcaUsd}</Text>
    </>
  )
}
