/* eslint-disable react/no-array-index-key */
import { Elevation } from 'config/constants/types'
import React, { useCallback } from 'react'
import { getFormattedBigNumber } from 'utils'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Modal, ModalActions, HighlightedText, Text, SummitButton  } from 'uikit'

export enum RewardsWillBeClaimedType {
  Farm = 'Farm',
  FullElevation = 'FullElevation',
  Elevate = 'Elevate'
}

const HorizontalDisplayBalance = styled(Flex)`
  align-items: center;
  justify-content: center;
`

interface Props {
  elevation: Elevation
  claimable?: BigNumber
  transactionName: string
  rewardClaimType: RewardsWillBeClaimedType
  elevateInfo?: {
    sourceElevation: Elevation,
    targetElevation: Elevation,
    sourceEarned: BigNumber,
    targetEarned: BigNumber,
  },
  transactionToConfirm?: () => () => void
  onDismiss?: () => void
}

export const RewardsWillBeClaimedModal: React.FC<Props> = ({
  elevation,
  claimable,
  transactionName,
  rewardClaimType,
  elevateInfo,
  transactionToConfirm,
  onDismiss = () => null,
}) => {


  const handleConfirm = useCallback(() => {
    if (transactionToConfirm != null) transactionToConfirm()
    onDismiss()
  }, [transactionToConfirm, onDismiss])

  switch(rewardClaimType) {
    case RewardsWillBeClaimedType.Elevate:
      if ((elevateInfo.sourceEarned || new BigNumber(0)).plus(elevateInfo.targetEarned || new BigNumber(0)).isEqualTo(0)) {
        handleConfirm()
      }
      break
      
    default:
    case RewardsWillBeClaimedType.Farm:
    case RewardsWillBeClaimedType.FullElevation:
      if (claimable.isEqualTo(0)) {
        handleConfirm()
      }
      break
  }

  const earningsOrWinnings = elevation === Elevation.OASIS ? 'earnings' : 'winnings'

  return (
    <Modal title={`${earningsOrWinnings}|br|TO FREEZE`} onDismiss={onDismiss} headerless elevationCircleHeader={elevateInfo?.targetElevation || elevation}>
      { (rewardClaimType === RewardsWillBeClaimedType.Farm || rewardClaimType === RewardsWillBeClaimedType.FullElevation) &&
        <>
          <Text bold monospace textAlign='center'>
            This {transactionName} will
            <br/>
            Freeze your available
          </Text>
          <HighlightedText summitPalette={elevation} gold fontSize='24px' mt='12px'>
            {getFormattedBigNumber(claimable)}
          </HighlightedText>
          <HighlightedText summitPalette={elevation} gold fontSize='16px' mb='12px'>
            SUMMIT
          </HighlightedText>
          <Text bold monospace textAlign='center'>
            {earningsOrWinnings} to the Glacier.
          </Text>
        </>
      }
      { rewardClaimType === RewardsWillBeClaimedType.Elevate &&
        <>
          <Text bold monospace mb='24px' textAlign='center'>
            Elevating will Freeze your earned rewards from
            <br/>
            both the source and target farms to the Glacier:
          </Text>
          { (elevateInfo?.sourceEarned || new BigNumber(0)).isGreaterThan(0) &&
            <HorizontalDisplayBalance>
              <HighlightedText summitPalette={elevateInfo.sourceElevation} fontSize='16px' mr='16px'>THE {elevateInfo.sourceElevation}: </HighlightedText>
              <HighlightedText summitPalette={elevateInfo.sourceElevation} fontSize='24px' mb='6px' mr='8px'>{getFormattedBigNumber(elevateInfo.sourceEarned)}</HighlightedText>
              <HighlightedText summitPalette={elevateInfo.sourceElevation} fontSize='16px'>SUMMIT</HighlightedText>
            </HorizontalDisplayBalance>
          }
          { (elevateInfo?.targetEarned || new BigNumber(0)).isGreaterThan(0) &&
            <HorizontalDisplayBalance>
              <HighlightedText summitPalette={elevateInfo.targetElevation} fontSize='16px' mr='16px'>THE {elevateInfo.targetElevation}: </HighlightedText>
              <HighlightedText summitPalette={elevateInfo.targetElevation} fontSize='24px' mb='6px' mr='8px'>{getFormattedBigNumber(elevateInfo.targetEarned)}</HighlightedText>
              <HighlightedText summitPalette={elevateInfo.targetElevation} fontSize='16px'>SUMMIT</HighlightedText>
            </HorizontalDisplayBalance>
          }
        </>
      }
      { [Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT].includes(elevation) && rewardClaimType !== RewardsWillBeClaimedType.FullElevation &&
        <Text bold monospace italic textAlign='center' small mt='24px'>
          This will only Freeze rewards from
          <br/>
          THIS specific farm at the {elevation}.
          <br/>
          It will not Freeze rewards from other farms.
        </Text>
      }


      <Text bold monospace italic small textAlign='center' mt='16px'>
        This will NOT reset your
        <br/>
        Decaying Withdrawal Fee or Loyalty Bonus
      </Text>

      <ModalActions>
        <SummitButton
          summitPalette={elevation}
          secondary
          onClick={handleConfirm}
          freezeSummitButton
          width='200px'
        >
          CONFIRM
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}
