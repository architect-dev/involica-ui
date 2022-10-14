import React from 'react'
import styled from 'styled-components'
import { ColumnStart, HighlightedText, Text } from 'uikit'
import { grainyGradientMixin } from 'uikit/util/styledMixins'

const Hero = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
  gap: 32px;
`

export const InvolicaStone = styled.div`
  border-radius: 81% 19% 39% 61% / 68% 42% 58% 32%;
  width: 64px;
  height: 64px;
  position: relative;
  background-color: white;

  ::after {
    content: ' ';
    position: absolute;
    bottom: -13px;
    right: -21px;
    border-radius: 81% 19% 39% 61% / 68% 42% 58% 32%;
    width: 64px;
    height: 64px;
    opacity: 0.5;
    transform: skew(-45deg) scaleY(0.6);
    background-color: ${({ theme }) => theme.colors.text};
    z-index: -3;
  }

  ${({ theme }) => grainyGradientMixin(!theme.isDark)}
`

export const StoneHeader: React.FC = () => {
  return (
    <Hero>
      <InvolicaStone />
      <ColumnStart>
      <HighlightedText className="sticky" fontSize="34px" letterSpacing="16px">
        INVOLICA
      </HighlightedText>
      <Text italic mt='-12px' ml='4px' small>DCA into a Stoneclad Portfolio</Text>
      </ColumnStart>
    </Hero>
  )
}
