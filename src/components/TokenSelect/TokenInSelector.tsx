import React, { useMemo } from 'react'
import { useConfigurableTokenIn, usePositionOuts } from 'state/hooks'
import { TokenSelectButton } from './TokenSelectButton'

export const TokenInSelector: React.FC = () => {
  const { tokenIn, setTokenIn } = useConfigurableTokenIn()
  const { outs } = usePositionOuts()

  const disabledReasons = useMemo(() => {
    const reasons = {}
    if (tokenIn != null) reasons[tokenIn] = 'Selected'
    ;(outs ?? []).forEach((out) => {
      reasons[out.token] = 'Used as DCA out'
    })
    return reasons
  }, [outs, tokenIn])

  return (
    <TokenSelectButton
      token={tokenIn}
      setToken={setTokenIn}
      noTokenString="Select"
      disabledTokens={disabledReasons}
      modalVariant="tokenIn"
    />
  )
}
