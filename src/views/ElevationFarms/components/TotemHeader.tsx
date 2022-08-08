import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import UnlockButton from 'components/UnlockButton'
import MultiElevTotemBattles from './ElevationTotemBattle'
import MultiElevStaked from './MultiElevStaked'
import { useWeb3React } from '@web3-react/core'
import MultiElevYieldBet from './MultiElevYieldBet'
import MultiElevWinningsAndClaim from './MultiElevWinningsAndClaim'
import { FarmHeaderTabSelector, FarmingTab } from './FarmHeaderTabSelector'
import ElevationRoundProgress from 'views/ElevationFarms/components/ElevationRoundProgress'
import { RoadmapTotemRow } from 'views/TravelersRoadmap/components/RoadmapTotemRow'

const HeaderCardsWrapper = styled(Flex)`
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 32px;
  margin: 0px auto 32px auto;
  max-width: 850px;
`

const HeaderWrapper = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 16px;
  padding-top: 220px;
  padding-bottom: 24px;
  margin-top: 64px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
  gap: 36px;
`

const HeaderButtonsRow = styled(Flex)`
  position: absolute;
  top: -86px;
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
`


const StyledUnlockButton = styled(UnlockButton)`
  margin: 32px auto 0px auto;
`

const TotemHeaderYieldWarsSection = memo(() => {
  return (
    <>
      <MultiElevTotemBattles/>
      <MultiElevYieldBet/>
    </>
  )
})

const TotemHeader: React.FC = () => {
  const { account } = useWeb3React()
  const [selectedTab, selectTab] = useState<FarmingTab>(FarmingTab.Farm)

  return (
    <HeaderCardsWrapper>
      <HeaderWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <HeaderButtonsRow flexDirection="row" justifyContent="space-around" alignItems="center">
          <RoadmapTotemRow />
        </HeaderButtonsRow>
        
        <ElevationRoundProgress/>
        <Flex width='100%' mt='12px' justifyContent='center' alignItems='center'>
          <FarmHeaderTabSelector
            selected={selectedTab}
            onSelect={selectTab}
          />
        </Flex>
        { account == null ?
          <StyledUnlockButton /> :
          <>
            { selectedTab === FarmingTab.YieldWars && <TotemHeaderYieldWarsSection/> }
            <MultiElevStaked/>
            <MultiElevWinningsAndClaim/>
          </>
        }
      </HeaderWrapper>
    </HeaderCardsWrapper>
  )
}

export default React.memo(TotemHeader)
