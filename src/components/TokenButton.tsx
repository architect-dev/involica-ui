import React from 'react'
import { useInvolicaStore } from 'state/store'
import { SummitButton, RowBetween, TokenSymbolImage } from 'uikit'

export const TokenButton: React.FC<{
  onClick?: () => void
  token: string | null
  noTokenString: string
}> = ({ onClick, token, noTokenString }) => {
  const tokenData = useInvolicaStore((state) => state.tokens?.[token])

  return (
    <SummitButton
      onClick={onClick}
      padding={tokenData == null ? '0px 12px' : '0 12px 0 2px'}
      width="100px"
    >
      {tokenData != null ? (
        <RowBetween>
          <TokenSymbolImage symbol={tokenData?.symbol} width={24} height={24} />
          {tokenData?.symbol}
        </RowBetween>
      ) : (
        noTokenString
      )}
    </SummitButton>
  )
}
