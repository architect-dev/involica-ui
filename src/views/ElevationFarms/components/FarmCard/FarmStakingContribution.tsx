import React, { useMemo } from 'react'
import { BN_ZERO, Elevation, elevationUtils, TokenSymbol } from 'config/constants'
import styled from 'styled-components'
import { Flex, Text } from 'uikit'
import { getFarmTotalStakedBalance } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import ElevationContributionBreakdown from '../ElevationContributionBreakdown'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

const StakingInfoItem = styled(Flex)`
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    order: 10;

    ${({ theme }) => theme.mediaQueries.nav} {
        order: unset;
    }
`

const InfoItemValue = styled(Flex)`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50px;
`

export interface ElevationsStaked {
    [Elevation.OASIS]: BigNumber
    [Elevation.PLAINS]: BigNumber
    [Elevation.MESA]: BigNumber
    [Elevation.SUMMIT]: BigNumber
}

interface Props {
    symbol: string
    elevation?: Elevation
    userDataLoaded: boolean
    elevationsStaked: ElevationsStaked
    pricePerToken: BigNumber
    decimals: number
}

const FarmStakingContribution: React.FC<Props> = ({ symbol, elevation, userDataLoaded, elevationsStaked, pricePerToken, decimals }) => {
    const { account } = useWeb3React()
    const isEverest = symbol === TokenSymbol.EVEREST

    const [stakedUSD, stakingContributions] = useMemo(
        () => {
            const tokenTotalStaked = getFarmTotalStakedBalance(elevationsStaked)
            
            const totalStaked: BigNumber = elevation == null ?
                tokenTotalStaked :
                elevationsStaked[elevation]
            const stakedDollarValue = totalStaked.div(new BigNumber(10).pow(decimals)).times(isEverest ? 1 : pricePerToken)

            const contributions = tokenTotalStaked.isEqualTo(0) ? [] : elevationUtils.all
                .map((elev, index) => ({
                    elevation: elev,
                    key: index,
                    perc: (elevationsStaked[elev] || BN_ZERO).times(100).dividedBy(tokenTotalStaked).toNumber()
                }))
                .filter((contrib) => contrib.perc > 0)

            return [stakedDollarValue, contributions]
        },
        [isEverest, elevation, elevationsStaked, pricePerToken, decimals]
    )

    return (
        <StakingInfoItem style={{ flex: 3 }}>
            <Flex alignItems='center' height='18px'>
                <Text small bold monospace mr='4px'>{elevation != null ? `${elevation} ` : ''}DEPOSITED:</Text>
                <Flex mb='2px'>
                    <CardValue
                        value={stakedUSD.toNumber()}
                        prefix={isEverest ? undefined : '$'}
                        postfix={isEverest ? 'EVEREST' : undefined}
                        decimals={2}
                        summitPalette={elevation}
                        fontSize="18"
                        postfixFontSize='14'
                    />
                </Flex>
            </Flex>
            <InfoItemValue width='100%'>
                <ElevationContributionBreakdown
                    loaded={account == null || userDataLoaded}
                    contributions={stakingContributions}
                    center
                />
            </InfoItemValue>
        </StakingInfoItem>
    )
}

export default React.memo(FarmStakingContribution)