import React from 'react'
import { Elevation } from 'config/constants/types'
import { useSummitEnabled } from 'state/hooks'
import styled from 'styled-components'
import { Card, CardBody, Text, HighlightedText, ExternalLinkButton, Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'

const StyledLaunchCard = styled(Card)`
  min-height: 376px;
  max-width: 600px;
  margin: 32px auto;
`

const StyledText = styled(Text)`
  padding-top: 16px;
  padding-bottom: 24px;
`

const StyledLink = styled(ExternalLinkButton)`
  margin: 16px auto;
`

const LaunchCard = () => {
  const summitEnabled = useSummitEnabled()

  if (summitEnabled) return null

  return (
    <StyledLaunchCard>
      <CardBody style={{height: '100%'}}>
        <HighlightedText header letterSpacing='5px'>
          SUMMIT DEFI
          <br/>
          PRESALE
        </HighlightedText>

        
        <Text bold monospace fontSize='16px' textAlign='center'>
          <br/>
          20000 SUMMIT
          <br/>
          Max 50 FTM per Wallet 
          <br/>
          Presale price: 2 SUMMIT / FTM
          <br/>
          Launch price: 1.55 SUMMIT / FTM
          <br/>
          <br/>
        </Text>
        <Text bold monospace fontSize='6px' textAlign='center'>
          Hey Im human sue me.
        </Text>
        <br/>


        <Flex flex={1}>
          <SummitButton as="a" margin='auto' external href="https://presale.money/app/#/presale/19" onClick={() => null}>
            SWAP FOR 
          </SummitButton>
        </Flex>

        <br/>
        <br/>





        <Flex flex={1}>
          <StyledLink summitPalette={Elevation.OASIS} href="https://github.com/Tibereum/obelisk-audits/blob/main/Summit.pdf">
            Audit
          </StyledLink>
          <StyledLink summitPalette={Elevation.OASIS} href="https://docs.summitdefi.com">
            Docs
          </StyledLink>
          <StyledLink summitPalette={Elevation.OASIS} href="https://discord.gg/summitdefi">
            Discord
          </StyledLink>
          <StyledLink summitPalette={Elevation.OASIS} href="https://twitter.com/summitdefi">
            Twitter
          </StyledLink>
          <StyledLink summitPalette={Elevation.OASIS} href="https://github.com/summit-defi/summit-contracts-pure">
            Contracts
          </StyledLink>
        </Flex>
      </CardBody>
    </StyledLaunchCard>
  )
}

export default LaunchCard
