import React from 'react'
import { Elevation, elevationUtils, elevToPalette } from 'config/constants/types'
import { Modal, Flex, Text, HighlightedText, ExternalLinkButton, SummitButton, ModalActions } from 'uikit'

interface Props {
  elevation?: Elevation
  onDismiss?: () => void
}

const ElevationExtendedDescription = {
  [Elevation.PLAINS]: (
    <Text>
      Stake tokens at higher elevation to earn more rewards.
      <br />
      The fabled {elevationUtils.getElevationTotemName(Elevation.PLAINS, 0, false)} vs {elevationUtils.getElevationTotemName(Elevation.PLAINS, 1, false)} battle rages over the plains.
      <br />
      Choose your totem and compete against the other.
      <br />
      <br />
      <br />
      <HighlightedText summitPalette={Elevation.PLAINS}>
        2 totems
        <br />
        1 hour rounds
        <br />
        50% chance of winning 2X rewards.
      </HighlightedText>
    </Text>
  ),
  [Elevation.MESA]: (
    <Text>
      Stake tokens at higher elevation to earn more rewards.
      <br />
      The arid MESA only supports the strongest of animals,
      <br />
      choose your totem wisely, it will be your champion.
      <br />
      <br />
      Win the round and steal the entire MESA yield,
      <br />
      but be careful, because they can do the same.
      <br />
      <br />
      <br />
      <HighlightedText summitPalette={Elevation.MESA}>
        5 totems
        <br />
        2 hour rounds
        <br />
        20% chance of winning 5X rewards.
      </HighlightedText>
    </Text>
  ),
  [Elevation.SUMMIT]: (
    <Text>
      THE SUMMIT is the highest elevation.
      <br />
      The highest risk, but also the highest rewards.
      <br />
      <br />
      Win the round and earn massive rewards,
      <br />
      but be careful, it is not for the feint of heart.
      <br />
      <br />
      <br />
      <HighlightedText summitPalette={Elevation.SUMMIT}>
        10 totems
        <br />
        4 hour rounds
        <br />
        10% chance of winning 10X rewards.
      </HighlightedText>
    </Text>
  ),
  [Elevation.EXPEDITION]: (
    <Text>
      Two COSMIC DEITIES rage against each other
      <br />
      over the fate of the expedition running below.
      <br />
      <br />
      Choose your Deity,
      <br />
      and deposit your SUMMIT and/or LP in fealty.
      <br />
      <br />
      <br />
      Each round the strength of the BULL and the BEAR changes,
      <br />
      watch their strengths to determine your deity.
      <br />
      <br />
      <br />
      <HighlightedText summitPalette={Elevation.SUMMIT} header mb="24px">
        COSMIC BEAR
        <br />
        vs
        <br />
        COSMIC BULL
      </HighlightedText>
      <Text bold monospace>
        24 HOUR Deposit WINDOWS
        <br />
        INSTANT REWARDS
      </Text>
      <br />
    </Text>
  ),
}

export const ElevationUnlockedModal: React.FC<Props> = ({ elevation, onDismiss }) => {
  return (
    <Modal
      title="JUST UNLOCKED"
      onDismiss={onDismiss}
      headerless
      elevationGlow={elevation}
      elevationCircleHeader={elevation}
    >
      <Flex alignItems="center" flexDirection="column">
        <Text textAlign="center">{ElevationExtendedDescription[elevation]}</Text>
        {elevation !== Elevation.EXPEDITION && (
          <Text italic fontSize="12px" mt="32px" textAlign="center">
            - Rewards vest over next round duration.
            <br />- Use <b>ELEVATE</b> to move funds between elevations without fees.
            <br />
            <br />
          </Text>
        )}
        <ExternalLinkButton summitPalette={elevToPalette(elevation)} href={elevationUtils.helpLink(elevation)}>
          LEARN MORE ABOUT THE {elevation}
        </ExternalLinkButton>
        <ModalActions>
          <SummitButton secondary elevation={elevation} onClick={onDismiss}>
            CLOSE
          </SummitButton>
          <SummitButton elevation={elevation} as="a" href={`/${elevation.toLowerCase()}`} onClick={onDismiss}>
            OPEN {elevation}
          </SummitButton>
        </ModalActions>
      </Flex>
    </Modal>
  )
}
