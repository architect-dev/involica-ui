import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Elevation, ElevationTitle, ElevationSubHeader } from 'config/constants/types'
import { Flex, HighlightedText, Text } from 'uikit'
import { useSelectedElevation } from 'state/hooks'

const StyledText = styled(Text)`
  padding-top: 16px;
  padding-bottom: 24px;
  font-style: italic;
`

const ExpeditionInfo: React.FC = () => {
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <StyledText textAlign="center" fontSize="small">
        Expeditions stake SUMMIT and earn rewards.
        <br />
        Rewards are risked, with two deities deciding the outcome
        <br />
        Each round has a different % chance of success (50-99)
        <br />
        If the expedition is successful, rewards are distributed to COSMIC BULL
        <br />
        If the expedition fails, COSMIC BEAR collects the rewards
        <br />
        <br />
        <b>CHOOSE YOUR DEITY BELOW TO UNLOCK THE EXPEDITION</b>
        <br />
        (deities can be changed at any time without loss)
      </StyledText>
    </Flex>
  )
}

export default React.memo(ExpeditionInfo)
