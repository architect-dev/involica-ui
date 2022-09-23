import React from 'react'
import { SummitButton, RowBetween } from 'uikit'
import TokenIconAndSymbol from './TokenIconAndSymbol'

export const TokenButton: React.FC<{
  onClick?: () => void
  token: string | null
  noTokenString: string
  changed?: boolean
}> = ({ onClick, token, noTokenString, changed }) => {
  return (
    <SummitButton
      onClick={onClick}
      padding={token == null ? '0px 12px' : '0 12px 0 2px'}
      width="100px"
      changed={changed}
    >
      {token != null ? (
        <RowBetween>
          <TokenIconAndSymbol token={token}/>
        </RowBetween>
      ) : (
        noTokenString
      )}
    </SummitButton>
  )
}
