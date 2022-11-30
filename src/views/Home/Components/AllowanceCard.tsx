import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import { MaxUint256 } from 'ethers/constants'
import { RowCenter, Text, SummitButton } from 'uikit'
import { usePositionAmountDCA, usePositionTokenInWithData } from 'state/hooks'
import { CellCol } from './styles'
import { bn, bnDisplay, eN } from 'utils'
import { SetAllowanceButton } from 'components/SetAllowanceModal'
import { useRevokeApproval } from 'hooks/useExecute'
import { DataRow } from 'uikit/components/DataRow'

export const AllowanceCard: React.FC = () => {
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

  return (
    <Card title="Allowance" padding="24px" halfWidth>
      <CellCol>
        <DataRow t="Current Allowance:" v={`${allowance} ${tokenInData?.symbol}`} />
        <DataRow
          t="DCAs Covered by Allowance:"
          v={
            <Text bold red={allowanceDCAs === 0}>
              {allowanceDCAs} DCAs
            </Text>
          }
        />
        <RowCenter>
          <SetAllowanceButton />
        </RowCenter>

        <br />
        <Text small italic>
          Revoke full approval:
          <br />
          (Will halt all future DCA executions)
        </Text>
        <RowCenter>
          <SummitButton
            onClick={onRevokeApproval}
            activeText="Revoke Approval"
            loadingText="Revoking Approval"
            isLoading={pending}
          />
        </RowCenter>
      </CellCol>
    </Card>
  )
}
