import React, { useCallback } from 'react'
import { Flex, Text, Modal, HighlightedText, ModalActions, SummitButton } from 'uikit'
import { getFormattedBigNumber } from '../../../utils/formatBalance'
import { LockSummitButtonType } from 'state/types'
import BigNumber from 'bignumber.js'
import { lockDurationTextLong, timestampToDateWithYear } from 'utils'
import { SummitPalette } from 'config/constants'

interface LockSummitConfirmModalProps {
  type: LockSummitButtonType
  lockDuration: number | null
  lockRelease: number
  everestAward: BigNumber
  onLockSummit: () => void
  onDismiss?: () => void
}

const LockSummitConfirmModal: React.FC<LockSummitConfirmModalProps> = ({
  type,
  lockDuration,
  lockRelease,
  everestAward,
  onLockSummit,
  onDismiss,
}) => {

  const rawEverestAward = getFormattedBigNumber(everestAward)
  const lockDurationString = lockDurationTextLong(lockDuration)
  const releaseDate = timestampToDateWithYear(lockRelease)

  const handleConfirm = useCallback(() => {
    onDismiss()
    onLockSummit()
  }, [onDismiss, onLockSummit])

  return (
    <Modal
      title=''
      onDismiss={onDismiss}
      elevationCircleHeader='EVEREST'
      headerless
    >
      <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text monospace small textAlign='center'>
          { type === LockSummitButtonType.LockSummit &&
            <>
              Confirm locking your SUMMIT for
              <br/>
              <Flex alignItems='center' gap='6px' justifyContent='center'>
                <Text bold monospace>{lockDurationString}</Text>
                <Text monospace small>until</Text>
                <Text bold monospace>{releaseDate}</Text>
              </Flex>
            </>
          }
          { type === LockSummitButtonType.IncreaseLockedSummit &&
            <>
              Confirm locking additional SUMMIT until
              <Text bold monospace>{releaseDate}</Text>
            </>
          }
          { type === LockSummitButtonType.IncreaseLockDuration &&
            <>
              Confirm an increased SUMMIT lock duration of
              <br/>
              <Flex alignItems='center' gap='6px' justifyContent='center'>
                <Text bold monospace>{lockDurationString}</Text>
                <Text monospace small>, unlocking on</Text>
                <Text bold monospace>{releaseDate}</Text>
              </Flex>
            </>
          }
        </Text>

        <Flex alignItems='center' justifyContent='center'>
          <Text monospace small textAlign='center'>
            EVEREST award:
          </Text>
          <HighlightedText summitPalette={SummitPalette.EVEREST} bold monospace fontSize='22px' ml='4px' mr='4px' lineHeight='22px'>{rawEverestAward}</HighlightedText>
          <HighlightedText summitPalette={SummitPalette.EVEREST} bold monospace fontSize='14px' ml='4px' mr='4px' lineHeight='14px'>EVEREST</HighlightedText>
        </Flex>

        <Text bold monospace textAlign='center'>
          LOCKED SUMMIT WILL ONLY UNLOCK
          <br/>
          WHEN THE LOCK PERIOD ENDS
        </Text>
      </Flex>
            

      <ModalActions>
        <SummitButton secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          summitPalette={SummitPalette.EVEREST}
          onClick={handleConfirm}
        >
          CONFIRM
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default LockSummitConfirmModal
