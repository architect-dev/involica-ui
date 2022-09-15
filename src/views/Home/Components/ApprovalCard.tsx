import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import { MaxUint256 } from 'ethers/constants'
import { RowBetween, RowCenter, Text, SummitPopUp, SummitButton } from 'uikit'
import { usePositionAmountDCA, usePositionTokenInWithData } from 'state/hooks'
import { CellCol } from './styles'
import { bn, bnDisplay, eN, useShowHideModal } from 'utils'
import { SetAllowanceModal } from 'components/SetAllowanceModal'
import { useRevokeApproval } from 'hooks/useExecute'

export const ApprovalCard: React.FC = () => {
  const { onRevokeApproval, pending } = useRevokeApproval()
  const { tokenInData, tokenInUserData } = usePositionTokenInWithData(true)
  const { amountDCA } = usePositionAmountDCA(true)

  const [allowance, allowanceDCAs] = useMemo(() => {
    const infAllowance = bn(tokenInUserData?.allowance).gt(bn(MaxUint256.div(2).toString()))
    const a = infAllowance ? 'Inf' : bnDisplay(tokenInUserData?.allowance, tokenInData?.decimals, 3)

    if (amountDCA === '' || amountDCA === '0' || isNaN(parseFloat(amountDCA))) return [a, 0]
    const aDCAs = infAllowance
      ? 'Inf'
      : Math.floor(bn(tokenInUserData?.allowance).div(eN(amountDCA, tokenInData?.decimals)).toNumber())
    return [a, aDCAs]
  }, [amountDCA, tokenInData?.decimals, tokenInUserData?.allowance])

  const [open, show, hide] = useShowHideModal()

  return (
    <Card title="Approval" padding="24px" halfWidth>
      <CellCol>
        <RowBetween>
          <Text small italic>
            Current Allowance:
          </Text>
          <Text bold>
            {allowance} {tokenInData?.symbol}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text small italic>
            DCAs Covered by Allowance:
          </Text>
          <Text bold red={allowanceDCAs === 0}>{allowanceDCAs} DCAs</Text>
        </RowBetween>
        <RowCenter>
          <SummitPopUp
            open={open}
            callOnDismiss={hide}
            modal
            button={<SummitButton onClick={show}>Set Allowance</SummitButton>}
            popUpTitle='Set Allowance'
            popUpContent={<SetAllowanceModal />}
          />
        </RowCenter>

        <br />
        <Text small italic>
          Revoke full approval:
          <br />
          (Will halt all future DCA executions)
        </Text>
        <RowCenter>
          <SummitButton onClick={onRevokeApproval} activeText="Revoke Approval" loadingText="Revoking Approval" isLoading={pending} />
        </RowCenter>
      </CellCol>
    </Card>
  )
}
