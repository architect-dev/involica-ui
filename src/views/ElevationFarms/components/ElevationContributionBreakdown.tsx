import { Elevation } from 'config/constants'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { Flex, Skeleton, Text } from 'uikit'

const BarHeight = 24

const elevationBarBorder = ({ theme, elevation }: { theme: DefaultTheme, elevation?: Elevation }): string => {
    if (elevation == null) return `
        background-color: transparent;
    `
    return `
        background-color: ${theme.colors[elevation]};
    `
}

const EmptyElevationBar = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: calc(100% - 2px);
    height: ${BarHeight}px;
    margin-left: 1px;
    margin-right: 1px;
    border: 1px dashed ${({ theme }) => theme.colors.text};
    background-color: transparent;
`

const ElevationBar = styled.div<{ elevation?: Elevation, perc: number }>`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${({ perc }) => `calc(${perc}% - 2px)`};
    height: ${BarHeight}px;
    margin-left: 1px;
    margin-right: 1px;
    ${elevationBarBorder}
`

const ElevationBarSkeleton = styled(Skeleton)`
    position: relative;
    width: 100%;
    height: ${BarHeight}px;
`

const ElevationText = styled(Text)`
    font-size: 13px;
    color: white;
    font-weight: bold;
`

const ValueText = styled(Text)`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    flex-wrap: wrap;
    overflow: hidden;
    bottom: -18px;
    text-align: center;
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`

const BarWrapper = styled(Flex)<{ hasTitle: boolean, center: boolean }>`
    flex-direction: row;
    align-items: ${({ center }) => center ? 'center' : 'flex-start' };
    justify-content: center;
    position: relative;
    width: 100%;
    height: 40px;
    margin-top: ${({ hasTitle }) => hasTitle ? 8 : 0}px;

    > * {
        &:first-child {
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
        }
        &:last-child {
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
        }
    }
`




interface Contribution {
    elevation?: Elevation
    val?: string
    key: number
    perc: number
}

const ContributionComponent: React.FC<Contribution> = ({elevation, val, perc}) => {
    return <ElevationBar perc={perc} elevation={elevation}>
        <ElevationText monospace small>{elevation}</ElevationText>
        <ValueText monospace bold>{val != null ? val : `${perc.toFixed(1)}%`}</ValueText>
    </ElevationBar>
}

interface Props {
    loaded: boolean
    title?: string
    contributions: Contribution[]
    center?: boolean
}

const ElevationContributionBreakdown: React.FC<Props> = ({ loaded, title, contributions, center = false}) => {
    return (
        <Wrapper>
            { title != null && <Text bold monospace>{title}</Text> }
            <BarWrapper hasTitle={title != null} center={center}>
                { !loaded ?
                    <ElevationBarSkeleton/> :
                    contributions.length === 0 ?
                        <EmptyElevationBar/> :
                        contributions.map((contribution) => 
                            <ContributionComponent key={contribution.key} {...contribution} />
                        )
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(ElevationContributionBreakdown)
