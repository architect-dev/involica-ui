import React, { useCallback } from 'react'
import { SummitButton, Text, RowBetween, RowCenter, SummitPopUp, TextButton } from 'uikit'
import { useShowHideModal } from 'utils'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { useExitPosition, usePausePosition } from 'hooks/useExecute'
import { Edit3 } from 'react-feather'

export const ManagePositionModal: React.FC<{
  unpauseOnly: boolean
  onDismiss?: () => void
}> = ({ onDismiss, unpauseOnly }) => {
  const { onPausePosition, pending: pausePending } = usePausePosition()
  const { onExitPosition, pending: exitPending } = useExitPosition()
  const paused = false

  const handleTogglePaused = useCallback(() => onPausePosition(!paused), [onPausePosition, paused])

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="350px" gap="12px">
      <Text small italic>
        Pausing your position will stop DCA execution, your position can be unpaused at any time:
      </Text>
      <RowBetween>
        <Text small italic>
          Current Paused Status:
        </Text>
        <Text bold>{paused ? 'Paused' : 'Active'}</Text>
      </RowBetween>

      <SummitButton
        isLoading={pausePending}
        onClick={handleTogglePaused}
        activeText={`${paused ? 'Unpause' : 'Pause'} Position`}
        loadingText={paused ? 'Unpausing' : 'Pausing'}
      />

      <br />

      {!unpauseOnly && (
        <>
          <Text small italic red>
            Exiting your position will delete all position data and return any unused gas funds:
          </Text>
          <SummitButton
            isLoading={exitPending}
            onClick={onExitPosition}
            activeText="Exit Position"
            loadingText="Exiting"
            variant="danger"
          />
        </>
      )}

      <br />
      <br />
      <RowCenter>
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}

export const ManagePositionButton: React.FC<{ unpauseOnly?: boolean }> = ({ unpauseOnly = false }) => {
  const [open, show, hide] = useShowHideModal()
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={
        unpauseOnly ? (
          <SummitButton onClick={show} activeText="Unpause Position" />
        ) : (
          <TextButton onClick={show}>
            {unpauseOnly ? 'Unpause' : 'Manage'} Position
            <Edit3 size="14px" />
          </TextButton>
        )
      }
      popUpTitle={unpauseOnly ? 'Unpause Position' : 'Manage Position'}
      popUpContent={<ManagePositionModal unpauseOnly={unpauseOnly} />}
    />
  )
}
