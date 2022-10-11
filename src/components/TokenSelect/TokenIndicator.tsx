import { transparentize } from 'polished'
import React from 'react'
import { useTokenOrNativePublicData } from 'state/hooks'
import styled from 'styled-components'
import { TokenSymbolImage } from 'uikit'

const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  min-width: 100px;
  padding: 0 12px 0 2px;
  border-radius: 14px;
  height: 28px;
  border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.text)};

  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.03em;
  line-height: 1;
`

export const TokenIndicator: React.FC<{
  token: string | null
  className?: string
}> = ({ token, className }) => {
  const { data: tokenData } = useTokenOrNativePublicData(token)

  return (
    <IndicatorWrapper className={className}>
      <TokenSymbolImage symbol={tokenData?.symbol} width={24} height={24} />
      {tokenData?.symbol}
    </IndicatorWrapper>
  )
}
