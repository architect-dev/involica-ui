import React from 'react'
import styled from 'styled-components'
import { HighlightedText } from 'uikit'
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

const StyledHighlightedText = styled(HighlightedText)<{
  fontSize: string
  letterSpacing: string
}>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 200;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

const Tutorial: React.FC = () => {
  return (
    <Page>
      <Hero>
        <StyledHighlightedText
          className="sticky"
          fontSize="34px"
          letterSpacing="16px"
        >
          INVOLICA
        </StyledHighlightedText>
      </Hero>

      <IntroSteps />
    </Page>
  )
}

export default Tutorial
