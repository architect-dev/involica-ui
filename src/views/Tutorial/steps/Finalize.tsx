import React, { useCallback, useMemo } from 'react'
import { SummitButton, Text } from 'uikit'
import { ethers } from 'ethers'
import { bn, eN } from 'utils'
import { PositionExpectedAndDurationOverview, PositionSwapsOverview } from './PositionOverviewElements'
import { useCreateAndFundPosition } from 'hooks/useExecute'
import {
  useNativeTokenPublicData,
  usePositionAmountDCA,
  useConfigFundingAmount,
  usePositionTokenInWithData,
} from 'state/hooks'
import { useSubmissionReadyPositionConfig } from 'state/introHooks'

export const Finalize: React.FC = () => {
  const { tokenInData, tokenInUserData } = usePositionTokenInWithData()
  const { nativeTokenData } = useNativeTokenPublicData()
  const { amountDCA } = usePositionAmountDCA()
  const { fundingAmount } = useConfigFundingAmount()

  const submissionReadyPosition = useSubmissionReadyPositionConfig()
  const { pending, onCreateAndFundPosition } = useCreateAndFundPosition()

  const handleCreatePosition = useCallback(() => {
    onCreateAndFundPosition(submissionReadyPosition, eN(fundingAmount, nativeTokenData?.decimals))
  }, [onCreateAndFundPosition, submissionReadyPosition, nativeTokenData?.decimals, fundingAmount])

  const limitedDCAs = useMemo(() => {
    if (amountDCA === '' || amountDCA === '0' || isNaN(parseFloat(amountDCA))) return '-'
    const infAllowance = bn(tokenInUserData?.allowance).gt(bn(ethers.constants.MaxUint256.div(2).toString()))
    const bDCAs = Math.floor(bn(tokenInUserData?.balance).div(eN(amountDCA, tokenInData?.decimals)).toNumber())
    const aDCAs = infAllowance
      ? 'Inf'
      : Math.floor(bn(tokenInUserData?.allowance).div(eN(amountDCA, tokenInData?.decimals)).toNumber())
    return bn(tokenInUserData?.balance).lt(tokenInUserData?.allowance) ? bDCAs : aDCAs
  }, [amountDCA, tokenInData?.decimals, tokenInUserData?.allowance, tokenInUserData?.balance])

  return (
    <>
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
        your position is created
        <br />
      </Text>
      <br />
      <SummitButton
        isLoading={pending}
        onClick={handleCreatePosition}
        activeText="Create Position"
        loadingText="Creating"
      />
    </>
  )
}
