import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Elevation } from 'config/constants/types'
import { Flex, Text, SummitButton } from 'uikit'
import { useSelectedElevation, useTotemSelectionPending } from 'state/hooks'
import { useElevationUserTotem } from 'state/hooksNew'
import { useWeb3React } from '@web3-react/core'
import { useSelectTotemModal } from 'components/SelectTotemModal'

const StyledText = styled(Text)`
  padding-top: 16px;
  padding-bottom: 24px;
  font-style: italic;
  max-width: 500px;
`

const Line1 = {
  [Elevation.OASIS]: 'Take a dip in the Oasis and let the Otter guide you to salvation',
  [Elevation.PLAINS]: 'Venture onto the Plains, where two mortal enemies are locked in a fabled race',
  [Elevation.MESA]: 'Only the strongest can survive the grueling conditions of the Mesa.',
  [Elevation.SUMMIT]: 'One missed step, a slight miscalculation, a tiny distraction: The End.',
  [Elevation.EXPEDITION]: 'The war rages above, two everlasting gods deciding the fate of all those below',
}

const Line2 = {
  [Elevation.OASIS]: null,
  [Elevation.PLAINS]: null,
  [Elevation.MESA]: 'Can you?',
  [Elevation.SUMMIT]: null,
  [Elevation.EXPEDITION]: null,
}

const Line3 = {
  [Elevation.OASIS]:
    'Our safest elevation, where you can rest and relax while the battles of the other elevations rage around you.',
  [Elevation.PLAINS]:
    "Don't let the soft grasses and rolling hills distract you from why you are here. Don't lose sight of your goal, for there is yield to be won, lost, and multiplied.",
  [Elevation.MESA]:
    "The Mesa is not a welcoming place, it will dry you out and grind your bones to dust, just more sand for the dunes. To survive here you'll need to watch your back, you never know whose stinger is aiming for it. Maybe the relaxing Oasis is more your speed?",
  [Elevation.SUMMIT]:
    "Don't let the totem's cute appearance distract you, you are not among friends at the Summit. You'll only feel their eyes watching you, following you, hunting you. You'll have to fight for what's yours, and even then, it might not be enough.",
  [Elevation.EXPEDITION]:
    'Gods waging war in a battle that will outlast us all. Do they even know we\'re watching, that we care about the outcome? Do our deposits and sacrifices mean anything to them, or are we as insignificant to them as two angry ant colonies are to us?',
}

const Line4 = {
  [Elevation.OASIS]: 'May your stay be comfy, relaxing, and rejuvenating.',
  [Elevation.PLAINS]: 'Let the shifting winds guide your Totem across the line.',
  [Elevation.MESA]: 'If you can endure the MESA, you will be rewarded in turn',
  [Elevation.SUMMIT]: "Are you sure you're ready...",
  [Elevation.EXPEDITION]: 'Choose your god, they may spare you yet.',
}

const ElevationIntroduction: React.FC = () => {
  const elevation = useSelectedElevation()
  const userTotem = useElevationUserTotem(elevation)
  const { account } = useWeb3React()
  const { onPresentSelectTotemModal } = useSelectTotemModal(elevation)
  const totemSelectionPending = useTotemSelectionPending()
  
  const handlePresentSelectTotemModal = useCallback(() => {
    if (totemSelectionPending) return
    onPresentSelectTotemModal()
  }, [totemSelectionPending, onPresentSelectTotemModal])

  if (elevation == null || userTotem != null) return null
  
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <StyledText textAlign="center" fontSize="small">
        <b>{Line1[elevation]}</b>
        <br />
        <br />
        {Line2[elevation] != null && (
          <>
            <b>{Line2[elevation]}</b>
            <br />
            <br />
          </>
        )}
        <br />
        {Line3[elevation]}
        <br />
        <br />
        {Line4[elevation]}
        <br/>
        <br/>
      </StyledText>
      { account != null && userTotem == null && <SummitButton
        summitPalette={elevation}
        onClick={handlePresentSelectTotemModal}
        isLoading={totemSelectionPending}
      >
        SELECT TOTEM
      </SummitButton> }
    </Flex>
  )
}

export default React.memo(ElevationIntroduction)
