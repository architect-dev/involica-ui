import { Elevation, elevationUtils } from 'config/constants'
import { linearGradient } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from 'uikit'
import { getPaletteGradientStops } from 'utils'

const ContributionWrapper = styled.div`
    display: flex;
    width: 100%;
    gap: 6px;
    height: 24px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`

const HorizontalBar = styled.div<{ noContributions?: boolean, elevation?: string, perc: number, maxPerc?: number }>`
    width: ${({ perc, maxPerc }) => `calc(${(100 * (perc / (maxPerc||100)))}% - 50px)`};
    transition: width 200ms;
    height: 24px;
    border-radius: 0px 12px 0px 0px;
    background: ${({ theme, elevation }) => elevation == null ? theme.colors.text : linearGradient({
        colorStops: getPaletteGradientStops(elevation as Elevation, true),
        toDirection: '120deg',
    })};
    box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.textShadow};
`
const EmptyHorizontalBar = styled.div`
    width: 96px;
    margin-right: -90px;
    border-radius: 0px 12px 0px 0px;
    height: 24px;
    border: 1px dashed ${({ theme }) => theme.colors.text};
`

const HorizontalBarSkeleton = styled(Skeleton)<{ width: number }>`
    width: ${({ width }) => width}px;
    height: 24px;
    border-radius: 0px 12px 0px 0px;
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 6px;
    margin-top: 12px;
`

const BarWrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 6px;
`


interface Contribution {
    title?: string
    val?: string
    key: number
    perc: number
    index?: number
}

const ContributionComponent: React.FC<Contribution & { maxPerc?: number }> = ({title, val, perc, maxPerc}) => {
    return <ContributionWrapper>
        <HorizontalBar elevation={title} perc={perc} maxPerc={maxPerc}/>
        <Text monospace bold lineHeight='14px'>{(val != null) ? val : `${perc.toFixed(1)}%`}</Text>
    </ContributionWrapper>
}
const EmptyContributionComponent: React.FC<{ elevation: Elevation, loaded: boolean }> = ({elevation, loaded}) => {
    return <ContributionWrapper>
        { loaded ?
            <>
                <EmptyHorizontalBar/>
                <Text monospace small lineHeight='14px'>{elevation} 0%</Text>
            </> :
            <HorizontalBarSkeleton width={elevation.length * 30 - 30}/>
        }
    </ContributionWrapper>
}

interface Props {
    loaded: boolean
    contributions: Contribution[]
}

const StakingBreakdown: React.FC<Props> = ({loaded, contributions}) => {
    const maxPerc = contributions.reduce((max, contrib) => Math.max(max, contrib.perc), 0)

    return (
        <Wrapper>
            <Text monospace>Farming Strategy:</Text>
            <BarWrapper>
                {
                    elevationUtils.all.map((elev) => {
                        const contribution = contributions.find((contrib) => contrib.title === elev)
                        if (contribution != null) {
                            return (<ContributionComponent key={elev} maxPerc={maxPerc} {...contribution} />)
                        }
                        return <EmptyContributionComponent elevation={elev} key={elev} loaded={loaded}/>
                    })
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(StakingBreakdown)
