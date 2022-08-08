import React from 'react'
import { RewardsWillBeClaimedModal, RewardsWillBeClaimedType } from './RewardsWillBeClaimedModal'
import { Elevation } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { useModal } from 'uikit'


export const useRewardsWillBeClaimedModal = (elevation: Elevation, claimable: BigNumber, transactionName, rewardClaimType: RewardsWillBeClaimedType) => {
  const [onPresentRewardsWillBeClaimedModal] = useModal(
    <RewardsWillBeClaimedModal
      elevation={elevation}
      claimable={claimable}
      transactionName={transactionName}
      rewardClaimType={rewardClaimType}
    />,
  )
  return onPresentRewardsWillBeClaimedModal
}
