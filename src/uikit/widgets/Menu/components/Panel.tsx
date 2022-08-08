import React from 'react'
import styled from 'styled-components'
import PanelBody from './PanelBody'
import PanelFooter from './PanelFooter'
import { SIDEBAR_WIDTH_FULL } from '../config'
import { MenuEntry, PanelProps, PushedProps } from '../types'
import SummitPrice from './SummitPrice'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
  additionals: MenuEntry[]
  summitPriceUsd: number
}

const StyledPanel = styled.div<{ isPushed: boolean }>`
  position: fixed;
  padding-top: 80px;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  width: ${({ isPushed }) => (isPushed ? 240 : 0)}px;
  background-color: ${({ theme }) => theme.colors.background};
  height: 100vh;
  transition: width 0.2s;
  z-index: 11;
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  transform: translate3d(0, 0, 0);

  ${({ theme }) => theme.mediaQueries.nav} {
    width: ${SIDEBAR_WIDTH_FULL}px;
    background-color: transparent;
  }
`

const MobileExcludedHeaderElements = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaQueries.invNav} {
    display: none;
  }
`

const Panel: React.FC<Props> = (props) => {
  const { isPushed, summitPriceUsd } = props
  return (
    <StyledPanel isPushed={isPushed}>
      <PanelBody {...props} />
      <MobileExcludedHeaderElements>
        <SummitPrice summitPriceUsd={summitPriceUsd} />
      </MobileExcludedHeaderElements>
      <PanelFooter {...props} />
    </StyledPanel>
  )
}

export default Panel
