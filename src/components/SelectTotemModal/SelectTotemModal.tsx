import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { useSelectTotemAndOrFaith } from 'hooks/useSelectTotem'
import React, { useCallback, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { getPaletteGradientFarmCardBackground } from 'utils'
import { RewardsWillBeClaimedType, useRewardsWillBeClaimedModal } from 'components/RewardsWillBeClaimedModal'
import InitialSelectionTotems from './InitialSelectionTotems'
import { Flex, Modal, ArtworkTotem, HighlightedText, Text, SummitButton } from 'uikit'
import FaithSlider from './FaithSlider'
import { useElevationUserTotem, useUserElevationClaimable } from 'state/hooksNew'

interface Props {
  elevation?: Elevation
  preselectedTotem?: number
  alsoSelectFaith?: boolean
  existingFaith?: number
  onDismiss?: () => void
}

const RainbowLight = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`

const StyledCardAccent = styled.div<{ elevationBackground: string }>`
  background: ${({ elevationBackground }) => elevationBackground};

  background-size: 200% 200%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 200px;
  filter: blur(30px);
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 3px;
  z-index: -1;
`

const TotemPadding = styled.div`
  margin: 12px;
  margin-top: 0px;
  position: relative;
  z-index: -1;
`

const FaithSliderWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
`

const SelectTotemModal: React.FC<Props> = ({
  elevation = Elevation.SUMMIT,
  preselectedTotem = null,
  alsoSelectFaith = false,
  existingFaith = null,
  onDismiss = () => null,
}) => {
  const userTotem = useElevationUserTotem(elevation)
  const claimable = useUserElevationClaimable(elevation)
  const presentRewardsWillBeClaimedModal = useRewardsWillBeClaimedModal(elevation, claimable || new BigNumber(0), 'Deposit', RewardsWillBeClaimedType.FullElevation)

  const { onSelectTotemAndOrSafetyFactor } = useSelectTotemAndOrFaith()
  const [totemToConfirm, setTotemToConfirm] = useState<number | null>(
    elevation === Elevation.OASIS ? 0 : preselectedTotem,
  )
  const [faithToConfirm, setFaithToConfirm] = useState<number | null>(
    existingFaith
  )
  const elevationBackground = getPaletteGradientFarmCardBackground(elevation)
  const handleSelectTotem = useCallback(async () => {
    onDismiss()
    presentRewardsWillBeClaimedModal(
      { transactionToConfirm: () => onSelectTotemAndOrSafetyFactor(
          elevation,
          totemToConfirm,
          faithToConfirm === existingFaith ? null : faithToConfirm
        ) 
      }
    )
  }, [onSelectTotemAndOrSafetyFactor, elevation, totemToConfirm, faithToConfirm, existingFaith, onDismiss, presentRewardsWillBeClaimedModal])
  const totemToConfirmName = elevationUtils.getElevationTotemName(elevation, totemToConfirm, false)
  const elevationName = `${elevation}`

  const updateFaithText = (!alsoSelectFaith || existingFaith === faithToConfirm) ?
    null :
    '(WITH FAITH)'

  return (
    <Modal
      title={totemToConfirm != null ? 'CONFIRM|br|TOTEM:' : 'SELECT|br|TOTEM:'}
      onDismiss={onDismiss}
      headerless
      elevationCircleHeader={elevation}
    >
      {totemToConfirm != null ? (
        <Flex alignItems="center" flexDirection="column">
          <HighlightedText summitPalette={elevation} header>
            THE {totemToConfirmName}
          </HighlightedText>
          <HighlightedText summitPalette={elevation} header={false} mb="24px">
            WILL BE YOUR {elevationName} GUIDE
          </HighlightedText>
          <TotemPadding>
            {elevation !== Elevation.EXPEDITION && <StyledCardAccent elevationBackground={elevationBackground} />}
            <ArtworkTotem elevation={elevation} totem={totemToConfirm} desktopSize="200" mobileSize="200" />
          </TotemPadding>
          { alsoSelectFaith &&
            <>
              <Text bold monospace small italic mt='-36px' textAlign='center' lineHeight='14px'>
                Set your FAITH in
                <br/>
                the {totemToConfirmName} (Optional)
                </Text>
              <FaithSliderWrapper>
                <FaithSlider
                    existingFaith={existingFaith}
                    setFaith={setFaithToConfirm}
                />
              </FaithSliderWrapper>
            </>
          }
          <SummitButton width='200px' padding='0px' mt='12px' summitPalette={elevation} onClick={handleSelectTotem}>
            CONFIRM
            {updateFaithText != null &&
              <>
                <br/>
                {updateFaithText}
              </>
            }
          </SummitButton>
        </Flex>
      ) : (
        <Flex alignItems="center" flexDirection="column">
          <Text textAlign="center" mb="18px">
            Totems compete for the pot of staking yield,
            <br />
            but only one can win each round.
            <br />
            Your yield contributed is moved to your new totem.
          </Text>
          <InitialSelectionTotems elevation={elevation} userTotem={userTotem} onSelect={setTotemToConfirm} />
        </Flex>
      )}
    </Modal>
  )
}

export default SelectTotemModal
