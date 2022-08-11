import React from 'react'
import styled from 'styled-components'
import { getSymbolParts } from 'utils';

const LpSymbolWrapper = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`
const BaseSymbolIcon = styled.div<{ symbol: string; width: number; height: number }>`
  position: absolute;
  background-image: ${({ symbol }) => `url("/images/tokens/${symbol}.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: drop-shadow(1px 1px 1px ${({ theme }) => theme.colors.textShadow});
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) scale(0.85);
`

const LpASymbolIcon = styled(BaseSymbolIcon)`
  top: -20%;
  left: -20%;
  z-index: 1;
  transform: scale(0.6);
`

const LpBSymbolIcon = styled(BaseSymbolIcon)`
  bottom: -10%;
  right: -10%;
  z-index: 2;
  transform: scale(0.8);
`

interface Props {
  symbol: string
  width: number
  height: number
}



const SymbolImage: React.FC<Props> = ({ symbol, width, height }) => {
  const symbolParts = getSymbolParts(symbol)
  return (
    <LpSymbolWrapper width={width} height={height}>
      <SingleSymbolIcon symbol={symbol} width={width} height={height} />
    </LpSymbolWrapper>
  )
}

export default SymbolImage
