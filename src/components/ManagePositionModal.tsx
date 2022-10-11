import React, { useCallback, useMemo } from 'react'
import { SummitButton, Text, RowCenter, SummitPopUp, TextButton } from 'uikit'
import { bnDisplay, useShowHideModal } from 'utils'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { useExitPosition, usePausePosition } from 'hooks/useExecute'
import { Edit3 } from 'react-feather'
import { getNativeTokenSymbol } from 'config/constants'
import { useIsPositionPaused, useUserTreasury } from 'state/hooks'
import { DataRow } from './DataRow'

export const ManagePositionModal: React.FC<{
  unpauseOnly: boolean
  onDismiss?: () => void
}> = ({ onDismiss, unpauseOnly }) => {
  const userTreasury = useUserTreasury()
  const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [
    userTreasury,
  ])

  const { onPausePosition, pending: pausePending } = usePausePosition()
  const { onExitPosition, pending: exitPending } = useExitPosition()
  const paused = useIsPositionPaused()

  const handleTogglePaused = useCallback(() => onPausePosition(!paused), [onPausePosition, paused])

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="350px" gap="12px">
      <Text small italic>
        Pausing your position will stop DCA execution, your position can be unpaused at any time:
      </Text>
      <DataRow t="Current Paused Status:" v={paused ? 'Paused' : 'Active'} />

      {!unpauseOnly && (
        <>
          <SummitButton
            isLoading={pausePending}
            onClick={handleTogglePaused}
            activeText={`${paused ? 'Unpause' : 'Pause'} Position`}
            loadingText={paused ? 'Unpausing' : 'Pausing'}
          />

          <br />

          <Text small italic red>
            Exiting your position will delete all position data and return your unused gas funds ({userTreasuryDisplay}{' '}
            {getNativeTokenSymbol()}):
          </Text>
          <SummitButton
            isLoading={exitPending}
            onClick={onExitPosition}
            activeText="Exit Position"
            loadingText="Exiting"
            variant="danger"
          />

          <br />
        </>
      )}
      <br />

      <RowCenter gap="18px">
        <SummitButton onClick={onDismiss} activeText="Close" variant="secondary" />
        {unpauseOnly && (
          <SummitButton
            isLoading={pausePending}
            onClick={handleTogglePaused}
            activeText="Unpause Position"
            loadingText="Unpausing"
            padding="0 18px"
          />
        )}
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
