import React, { useMemo } from 'react'
import { Card } from 'components/Card'
import { MaxUint256 } from 'ethers/constants'
import { RowBetween, RowCenter, Text, SummitPopUp, SummitButton } from 'uikit'
import { usePositionAmountDCA, usePositionTokenInWithData } from 'state/hooks'
import { CellCol } from './styles'
import { bn, bnDisplay, eN, useShowHideModal } from 'utils'
import { IncreaseApprovalModal } from 'components/IncreaseApprovalModal'

export const ApprovalCard: React.FC = () => {
  const { tokenInData, tokenInUserData } = usePositionTokenInWithData()
  const { amountDCA } = usePositionAmountDCA()

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
          <Text bold>{allowanceDCAs} DCAs</Text>
        </RowBetween>
        <RowCenter>
          <SummitPopUp
            open={open}
            callOnDismiss={hide}
            modal
            button={<SummitButton onClick={show}>Increase Approval</SummitButton>}
            popUpContent={<IncreaseApprovalModal />}
          />
        </RowCenter>
      </CellCol>
    </Card>
  )
}
