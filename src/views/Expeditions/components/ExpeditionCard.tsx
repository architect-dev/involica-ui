import React from 'react'
import FlexLayout from 'components/layout/Flex'
import { ExpeditionRewardTokens } from './ExpeditionRewardTokens'
import { ExpeditionWinnings } from './ExpeditionWinnings'
import { ExpeditionStats } from './ExpeditionStats'
import { ExpeditionUserSection } from './ExpeditionUserSection'
import ElevationRoundProgress from 'views/ElevationFarms/components/ElevationRoundProgress'



const ExpeditionCard: React.FC = () => {
  return (
    <FlexLayout>
      <ExpeditionRewardTokens/>
      <ElevationRoundProgress/>
      <ExpeditionWinnings/>
      <ExpeditionUserSection/>
      <ExpeditionStats/>
    </FlexLayout>
  )
}

export default ExpeditionCard
