import React from 'react'
import { SummitButton, RowBetween } from 'uikit'
import TokenIconAndSymbol from './TokenIconAndSymbol'

export const TokenButton: React.FC<{
  onClick?: () => void
  token: string | null
  noTokenString: string
  disabled?: boolean
  changed?: boolean
  invertColor?: boolean
}> = ({ onClick, token, noTokenString, changed, disabled, invertColor = false }) => {
  return (
    <SummitButton
      onClick={onClick}
      disabled={disabled}
      padding={token == null ? '0px 12px' : '0 12px 0 2px'}
      width="100px"
      changed={changed}
      variant={invertColor ? 'inverted' : 'primary'}
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
