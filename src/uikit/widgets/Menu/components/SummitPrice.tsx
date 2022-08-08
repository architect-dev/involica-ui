import React from 'react'
import styled from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { LogoRoundIcon } from '../../../components/Svg'
import { Text } from '../../../components/Text/Text'
import SummitTokenPopUp from './SummitTokenPopUp'

interface Props {
  summitPriceUsd?: number
}

const PriceLink = styled.div`
  display: flex;
  opacity: 0.5;
  gap: 6px;
  align-items: center;

  ${pressableMixin}
`

const DesktopOnlyText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
  }
`

const SummitPrice: React.FC<Props> = ({ summitPriceUsd }) => {
  return (
    <SummitPopUp
      position='bottom right'
      button={
        <PriceLink>
          <LogoRoundIcon width="32px" />
          <DesktopOnlyText monospace bold>{`$${
            summitPriceUsd ? summitPriceUsd.toFixed(3) : 'XX.XX'
          }`}</DesktopOnlyText>
        </PriceLink>
      }
      contentPadding='12px'
      popUpContent={
        <SummitTokenPopUp summitPriceUsd={summitPriceUsd}/>
      }
    />
  )
}

export default React.memo(SummitPrice, (prev, next) => prev.summitPriceUsd === next.summitPriceUsd)
