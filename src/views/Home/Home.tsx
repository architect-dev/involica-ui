import React from 'react'
import styled from 'styled-components'
import { HighlightedText, Text } from 'uikit'
import Page from 'components/layout/Page'
import { IntroSteps } from './steps/IntroSteps'

const Hero = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
`

const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 900;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

const Home: React.FC = () => {
  return (
    <Page>
      <Hero>
        <StyledHighlightedText fontSize="32px" letterSpacing="16px">
          INVOLICA
        </StyledHighlightedText>
      </Hero>

      <IntroSteps/>
    </Page>
  )
}

export default Home
