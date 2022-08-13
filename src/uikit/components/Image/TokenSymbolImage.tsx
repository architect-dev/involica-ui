import React from 'react'
import styled from 'styled-components'

const LpSymbolWrapper = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`
const BaseSymbolIcon = styled.div<{
  symbol: string
  width: number
  height: number
}>`
  position: absolute;
  background-image: ${({ symbol }) => `url("/images/tokens/${symbol}.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) scale(0.85);
`

interface Props {
  symbol: string
  width: number
  height: number
}

const SymbolImage: React.FC<Props> = ({ symbol, width, height }) => {
  return (
    <LpSymbolWrapper width={width} height={height}>
      <SingleSymbolIcon symbol={symbol} width={width} height={height} />
    </LpSymbolWrapper>
  )
}

export default SymbolImage
