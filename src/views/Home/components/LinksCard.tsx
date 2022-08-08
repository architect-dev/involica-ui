import React from 'react'
import { Card, CardBody, Flex, HighlightedText, OpenNewIcon, Text } from 'uikit'
import styled from 'styled-components'
import { ElevOrPalette } from 'config/constants'
import { pressableMixin } from 'uikit/util/styledMixins'
import SocialLinks from 'uikit/widgets/Menu/components/SocialLinks'

const StyledSummitStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

export const ObeliskImage = styled.div`
  background-image: url("/images/summit/OBELISK.png");
  width: 72px;
  height: 72px;
  background-size: cover;
`

const StyledExternalIcon = styled(OpenNewIcon)<{ summitPalette?: ElevOrPalette }>`
  fill: ${({ theme }) => theme.colors.OASIS};
  width: 18px;
  height: 18px;
`

const PressableFlex = styled(Flex)`
  ${pressableMixin}
`

const LinkText = styled(Text)`
  color: ${({ theme }) => theme.colors.OASIS};
`

const LinksCard: React.FC = () => {

  return (
    <StyledSummitStats>
      <CardBody>
        <HighlightedText header mb="24px">
          COMMUNITY
        </HighlightedText>

        <Text bold monospace textAlign='center' margin='auto'>Connect With Summit DeFi:</Text>
        <SocialLinks/>
      </CardBody>
    </StyledSummitStats>
  )
}

export default LinksCard
