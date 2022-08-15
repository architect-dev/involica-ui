import React, { useCallback, useMemo, useState } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Column, RowStart, SummitButton, Text } from 'uikit'
import { useInvolicaStore } from 'state/zustand'
import { bn, bnDisplay } from 'utils'
import {
  IntroStep,
  useIntroActiveStep,
  usePositionConfigState,
} from './introStore'
import { useApprove } from 'hooks/useExecute'
import NumericInput from 'components/Input/NumericInput'

export const ApproveIn: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Approve

  const tokenInAdd = usePositionConfigState((state) => state.tokenIn)
  const tokenIn = useInvolicaStore((state) => state.tokens?.[tokenInAdd])
  const tokenInUserData = useInvolicaStore(
    (state) => state.userData?.userTokensData?.[tokenInAdd],
  )
  const amountDCA = usePositionConfigState((state) => state.amountDCA)
  const { onApprove, onInfApprove, pending } = useApprove(
    tokenIn?.symbol,
    tokenInAdd,
  )

  console.log({
    tokenInUserData,
  })

  const allowance = useMemo(
    () => bnDisplay(tokenInUserData?.allowance, tokenIn?.decimals),
    [tokenIn?.decimals, tokenInUserData?.allowance],
  )

  const [dcasCount, setDcasCount] = useState('')
  const handleSetDcasCount = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setDcasCount(e.currentTarget.value)
    },
    [setDcasCount],
  )
  const handleSetInf = useCallback(() => setDcasCount(`Inf`), [setDcasCount])

  const approvalAmount = useMemo(
    () =>
      dcasCount === 'Inf'
        ? 'Inf'
        : bnDisplay(
            bn(amountDCA)
              .times(dcasCount === '' ? '0' : parseInt(dcasCount))
              .minus(tokenInUserData?.allowance ?? 0),
            tokenIn?.decimals,
            3,
          ),
    [amountDCA, dcasCount, tokenIn?.decimals, tokenInUserData?.allowance],
  )

  const alreadyApproved = useMemo(
    () =>
      bn(tokenInUserData?.allowance ?? 0).gte(
        bn(amountDCA).times(dcasCount === '' ? '0' : parseInt(dcasCount)),
      ),
    [amountDCA, dcasCount, tokenInUserData?.allowance],
  )

  const handleApprove = useCallback(() => {
    if (dcasCount === 'Inf') onInfApprove()
    onApprove(bn(amountDCA).times(dcasCount).toString(), 0)
  }, [amountDCA, dcasCount, onApprove, onInfApprove])

  const clearIfInf = useCallback(() => {
    if (dcasCount === 'Inf') setDcasCount('')
  }, [dcasCount, setDcasCount])

  return (
    <StepContentWrapper expanded={expanded}>
      <Text small>
        Involica only pulls your in token during a DCA transaction.
        <br />
        The amount you approve determines how many times your DCA will run.
        <br />
        <br />
        <i>
          Enter the amount of DCA transactions you want to run,
          <br />
          and then approve your <b>{tokenIn?.symbol}</b> spends:
          <br />
          (Infinite Approval will continue to DCA until your wallet
          <br />
          balance runs out or Involica manually stopped)
        </i>
      </Text>
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
          Amount to approve: {alreadyApproved ? 0 : approvalAmount} {tokenIn?.symbol}
        </Text>
        {bn(tokenInUserData?.allowance).toNumber() > 0 && (
          <Text small italic>
            Current allowance: ({allowance} {tokenIn?.symbol}){!alreadyApproved && ' subtracted'}
          </Text>
        )}
      </Column>
      <SummitButton
        disabled={
          alreadyApproved ||
          dcasCount === '0' ||
          dcasCount === '' ||
          approvalAmount === 'NaN'
        }
        isLoading={pending}
        onClick={handleApprove}
        activeText={alreadyApproved ? 'Already Approved' : 'Approve'}
        loadingText="Approving"
      />
    </StepContentWrapper>
  )
}
