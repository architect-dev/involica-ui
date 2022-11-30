import React from 'react'
import { SummitButton, Text, RowCenter, SummitPopUp } from 'uikit'
import { useShowHideModal } from 'utils'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { useManuallyExecuteDCA } from 'hooks/useExecute'
import { useAllowanceIsSufficient } from 'state/hooks'

export const ManualExecutionModal: React.FC<{
  onDismiss?: () => void
}> = ({ onDismiss }) => {
  const { onManuallyExecuteDCA, pending } = useManuallyExecuteDCA()
  const allowanceIsSufficient = useAllowanceIsSufficient()

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="350px" gap="12px">
      <Text small italic>
        If you like where the market is at, you can manually execute an immediate DCA.
        <br/>
        <br/>
        This does not interfere with automatic DCAs, and the next automatic DCA will still occur at the next interval.
      </Text>

      <br/>

      <RowCenter gap="18px">
        <SummitButton onClick={onDismiss} activeText="Close" variant="secondary" />
        <SummitButton
          onClick={onManuallyExecuteDCA}
          isLoading={pending}
          disabled={!allowanceIsSufficient}
          padding='0px 12px'
          activeText="Manually Execute DCA"
          loadingText="Executing DCA"
        />
      </RowCenter>
    </ModalContentContainer>
  )
}

export const ManualExecutionModalButton: React.FC = () => {
  const [open, show, hide] = useShowHideModal()

  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<SummitButton onClick={show} padding='0px 8px' activeText="Manual DCA" />}
      popUpTitle='Manually Execute DCA'
      popUpContent={<ManualExecutionModal />}
    />
  )
}
