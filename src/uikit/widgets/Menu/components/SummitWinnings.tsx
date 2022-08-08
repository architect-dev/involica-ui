import React from 'react'
import styled from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SummitPopUp } from 'uikit/widgets/Popup'
import SummitWinningsPopUp from './SummitWinningsPopUp'

const IconWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  
  width: 36px;
  height: 36px;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: 32px;
    height: 32px;
  }

  ${pressableMixin}
`

const WinningsIcon = styled.div`
  position: absolute;
  background-image: url("/images/tokens/SUMMITWinnings.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 66px;
  height: 66px;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: 61px;
    height: 61px;
  }
`

const SummitWinnings: React.FC = () => {
  return (
    <SummitPopUp
      position='bottom right'
      button={
        <IconWrapper>
          <WinningsIcon/>
        </IconWrapper>
      }
      contentPadding='12px'
      popUpContent={
        <SummitWinningsPopUp/>
      }
    />
  )
}

export default React.memo(SummitWinnings)
