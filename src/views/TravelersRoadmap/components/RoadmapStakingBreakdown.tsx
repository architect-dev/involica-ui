import { BN_ZERO } from "config/constants"
import React from "react"
import { useMultiElevStaked } from "state/hooks"
import { useAvgStakingLoyaltyDuration, useFarmsUserDataLoaded } from "state/hooksNew"
import styled from "styled-components"
import { Text } from "uikit"
import { stakeDurationToText } from "utils"
import StakingBreakdown from "./StakingBreakdown"


const StakingBreakdownWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 42px;
    
    
    ${({ theme }) => theme.mediaQueries.nav} {
        margin-right: 32px;
        flex: 3;
        width: unset;
        margin-bottom: 0px;
    }
`

const InfoItemWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: calc(100% - 32px);

    ${({ theme }) => theme.mediaQueries.nav} {
        margin-right: 32px;
        width: calc(100% - 32px);
        margin-right: 32px;
    }
`


const RoadmapStakingBreakdown: React.FC = () => {
    const { totalTVL, tvlContributions } = useMultiElevStaked()
    const userDataLoaded = useFarmsUserDataLoaded()
    const avgStakingDuration = useAvgStakingLoyaltyDuration()
    const stakingDurationText = stakeDurationToText(avgStakingDuration)
    const rawTotalTVL = (totalTVL || BN_ZERO).toNumber().toFixed(2)

    return (
        <StakingBreakdownWrapper>
            <Text italic style={{ width: '100%' }} textAlign='left' mb='12px' bold monospace>ELEVATION FARMING:</Text>
            <InfoItemWrapper>
                <Text monospace>Avg Stake Duration:</Text>
                <Text bold monospace>{stakingDurationText}</Text>
            </InfoItemWrapper>
                <InfoItemWrapper>
                    <Text monospace>Staked Amount</Text>
                    <Text bold monospace>{`$${rawTotalTVL}`}</Text>
                </InfoItemWrapper>
            <StakingBreakdown
                loaded={userDataLoaded}
                contributions={tvlContributions}
            />
        </StakingBreakdownWrapper>
    )
}

export default React.memo(RoadmapStakingBreakdown)