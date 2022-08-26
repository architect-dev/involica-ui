import React, { useCallback, useMemo } from 'react'
import { Column, RowStart, SummitButton, Text } from 'uikit'
import { MaxUint256 } from 'ethers/constants'
import { bn, bnDisplay, eN } from 'utils'
import { useApprove } from 'hooks/useExecute'
import NumericInput from 'components/Input/NumericInput'
import styled from 'styled-components'
import { useConfigurableDcasCount, usePositionAmountDCA, usePositionTokenInWithData } from 'state/hooks'

const IntroText = styled(Text)`
  max-width: 500px;
`

export const ApproveIn: React.FC = () => {
  const { tokenIn, tokenInData, tokenInUserData } = usePositionTokenInWithData()
  const { amountDCA } = usePositionAmountDCA()
  const { onApprove, onInfApprove, pending } = useApprove(
    tokenInData?.symbol,
    tokenIn,
  )
  const { dcasCount, setDcasCount } = useConfigurableDcasCount()

  const allowance = useMemo(
    () => {
      if (bn(tokenInUserData?.allowance).gte(bn(MaxUint256.toString()).div(2))) return 'Inf'
      return bnDisplay(tokenInUserData?.allowance, tokenInData?.decimals)
    },
    [tokenInData?.decimals, tokenInUserData?.allowance],
  )

  const handleSetDcasCount = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setDcasCount(e.currentTarget.value)
    },
    [setDcasCount],
  )
  const handleSetInf = useCallback(() => setDcasCount(`Inf`), [setDcasCount])

  const approvalAmount = useMemo(() => {
    if (dcasCount === 'Inf') return 'Inf'
    if (dcasCount === '' || dcasCount === '' || isNaN(parseInt(dcasCount)))
      return '-'
    return bnDisplay(
      bn(eN(amountDCA, tokenInData?.decimals))
        .times(dcasCount === '' ? '0' : parseInt(dcasCount))
        .minus(tokenInUserData?.allowance ?? 0),
      tokenInData?.decimals,
      3,
    )
  }, [amountDCA, dcasCount, tokenInData?.decimals, tokenInUserData?.allowance])

  const alreadyApproved = useMemo(
    () => {
      if (approvalAmount === 'Inf') return allowance === 'Inf'
      return bn(approvalAmount).lte(0)
    },
    [allowance, approvalAmount]
  )

  const handleApprove = useCallback(() => {
    if (dcasCount === 'Inf') onInfApprove()
    else onApprove(bn(amountDCA).times(dcasCount).toString(), tokenInData?.decimals)
  }, [amountDCA, dcasCount, onApprove, onInfApprove, tokenInData?.decimals])

  const clearIfInf = useCallback(() => {
    if (dcasCount === 'Inf') setDcasCount('')
  }, [dcasCount, setDcasCount])

  return (
    <>
      <IntroText small>
        Involica withdraws your spend token when you DCA. Your approval amount
        determines how many times you will DCA.
        <br />
        <br />
        <i>
          Enter the amount of DCA transactions you want to run, and then approve
          your <b>{tokenInData?.symbol}</b> spends:
          <br />
          <br />
          (Infinite Approval will continue to DCA until your wallet balance runs
          out or Involica manually stopped)
        </i>
      </IntroText>
      <RowStart gap="8px">
        <NumericInput
          value={dcasCount}
          onChange={handleSetDcasCount}
          endText="dcas"
          onFocus={clearIfInf}
          placeholder="0"
        />
        <Text small>- or -</Text>
        <SummitButton
          activeText="Inf DCAs"
          width="120px"
          padding="0"
          onClick={handleSetInf}
        />
      </RowStart>
      <br />
      <Column>
        <Text>
          Amount to approve: {alreadyApproved ? 0 : approvalAmount}{' '}
          {tokenInData?.symbol}
        </Text>
        {bn(tokenInUserData?.allowance).toNumber() > 0 && (
          <Text small italic>
            Current allowance: ({allowance} {tokenInData?.symbol})
            {!alreadyApproved && ' subtracted'}
          </Text>
        )}
      </Column>
      <SummitButton
        disabled={
          alreadyApproved ||
          dcasCount === '0' ||
          dcasCount === '' ||
          approvalAmount === '-'
        }
        isLoading={pending}
        onClick={handleApprove}
        activeText={
          alreadyApproved && dcasCount != null && (dcasCount === 'Inf' || parseInt(dcasCount) > 0)
            ? 'Approved'
            : `${dcasCount === 'Inf' ? 'Inf ' : ''}Approve`
        }
        loadingText="Approving"
      />
    </>
  )
}
