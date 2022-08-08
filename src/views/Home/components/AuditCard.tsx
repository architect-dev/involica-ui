import React from 'react'
import { Card, CardBody, Flex, HighlightedText, OpenNewIcon, Text } from 'uikit'
import styled from 'styled-components'
import { ElevOrPalette } from 'config/constants'
import { pressableMixin } from 'uikit/util/styledMixins'

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
  fill: ${({ theme }) => theme.colors.textSubtle};
  width: 18px;
  height: 18px;
`

const PressableFlex = styled(Flex)`
  ${pressableMixin}
`

const LinkText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const AuditCard: React.FC = () => {

  return (
    <StyledSummitStats>
      <CardBody>
        <HighlightedText header mb="24px">
          SECURITY
        </HighlightedText>

        <PressableFlex mb='24px' justifyContent='space-between' alignItems='center' as='a' href='https://github.com/Tibereum/obelisk-audits/blob/main/Summitv2.pdf' target='_blank' rel="noreferrer noopener">
          <Flex justifyContent='center' alignItems='center' gap='8px'>
            <LinkText bold monospace>
              SUMMIT DEFI Contracts
              <br/>
              AUDIT By OBELISK
            </LinkText>
            <StyledExternalIcon width="20px" />
          </Flex>
          <ObeliskImage/>

        </PressableFlex>

        <PressableFlex mb='12px' justifyContent='flex-start' alignItems='center' as='a' href='https://github.com/summit-defi/summit-contracts-v2' target='_blank' rel="noreferrer noopener">
          <Flex justifyContent='center' alignItems='center' gap='8px'>
            <LinkText bold monospace>
              SUMMIT DEFI Contracts
            </LinkText>
            <StyledExternalIcon width="20px" />
          </Flex>
        </PressableFlex>

        <PressableFlex justifyContent='flex-start' alignItems='center' as='a' href='https://htmlpreview.github.io/?https://raw.githubusercontent.com/summit-defi/summit-contracts-v2/master/coverage/contracts/index.html' target='_blank' rel="noreferrer noopener">
          <Flex justifyContent='center' alignItems='center' gap='8px'>
            <LinkText bold monospace>
              SUMMIT Contracts Testing Coverage
            </LinkText>
            <StyledExternalIcon width="20px" />
          </Flex>
        </PressableFlex>
      </CardBody>
    </StyledSummitStats>
  )
}

export default AuditCard
