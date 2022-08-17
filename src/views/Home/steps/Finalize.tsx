import React, { useCallback, useMemo } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { SummitButton, Text } from 'uikit'
import {
  IntroStep,
  useIntroActiveStep,
  usePositionConfig,
  usePositionConfigState,
  useSubmissionReadyPositionConfig,
} from './introStore'
import { ethers } from 'ethers'
import { useInvolicaStore } from 'state/zustand'
import { bn, eN } from 'utils'
import {
  PositionExpectedAndDurationOverview,
  PositionSwapsOverview,
} from './PositionOverviewElements'
import { useSetPosition } from 'hooks/useExecute'

export const Finalize: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Finalize
  const tokenIn = usePositionConfigState((state) => state.tokenIn)
  const tokenData = useInvolicaStore((state) => state.tokens?.[tokenIn])
  const amountDCA = usePositionConfigState((state) => state.amountDCA)
  const userTokenData = useInvolicaStore(
    (state) => state.userData?.userTokensData?.[tokenIn],
  )
  const submissionReadyPosition = useSubmissionReadyPositionConfig()
  const { pending, onSetPosition } = useSetPosition()

  const handleCreatePosition = useCallback(() => {
    onSetPosition(submissionReadyPosition, true)
  }, [onSetPosition, submissionReadyPosition])

  const limitedDCAs = useMemo(() => {
    if (amountDCA === '' || amountDCA === '0' || isNaN(parseFloat(amountDCA)))
      return '-'
    const infAllowance = bn(userTokenData?.allowance).gt(
      bn(ethers.constants.MaxUint256.div(2).toString()),
    )
    const bDCAs = Math.floor(
      bn(userTokenData?.balance)
        .div(eN(amountDCA, tokenData?.decimals))
        .toNumber(),
    )
    const aDCAs = infAllowance
      ? 'Inf'
      : Math.floor(
          bn(userTokenData?.allowance)
            .div(eN(amountDCA, tokenData?.decimals))
            .toNumber(),
        )
    return bn(userTokenData?.balance).lt(userTokenData?.allowance)
      ? bDCAs
      : aDCAs
  }, [
    amountDCA,
    tokenData?.decimals,
    userTokenData?.allowance,
    userTokenData?.balance,
  ])

  return (
    <StepContentWrapper expanded={expanded}>
      <Text small italic>
        Confirm the setup of your Involica Position:
      </Text>

      <PositionSwapsOverview />

      <Text small italic>
        With this setup, you can expect {limitedDCAs} DCAs to execute:
        <br />
        (can be cancelled early at any time)
      </Text>

      <PositionExpectedAndDurationOverview />

      <Text small italic>
        note: Your first DCA will execute immediately after
        <br />
        your position is created:
        <br />
      </Text>
      <SummitButton
        isLoading={pending}
        onClick={handleCreatePosition}
        activeText="Create Position"
        loadingText="Creating"
      />
    </StepContentWrapper>
  )
}
