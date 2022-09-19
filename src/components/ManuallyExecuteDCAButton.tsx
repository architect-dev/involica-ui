import React from 'react'
import { ColumnStart, SummitButton, Text } from 'uikit'
import { useManuallyExecuteDCA } from 'hooks/useExecute'
import { useAllowanceIsSufficient } from 'state/hooks'

export const ManuallyExecuteDCAButton: React.FC = () => {
  const { onManuallyExecuteDCA, pending } = useManuallyExecuteDCA()
  const allowanceIsSufficient = useAllowanceIsSufficient()

  return (
    <ColumnStart alignItems="center" gap="4px">
      <SummitButton
        onClick={onManuallyExecuteDCA}
        isLoading={pending}
        disabled={!allowanceIsSufficient}
        activeText="Manually Execute DCA"
        loadingText="Executing DCA"
      />
      {!allowanceIsSufficient && (
        <Text small italic red>
          Insufficient Allowance
        </Text>
      )}
    </ColumnStart>
  )
}
