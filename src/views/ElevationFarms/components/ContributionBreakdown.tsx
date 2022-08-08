import { Elevation } from 'config/constants'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { ElevationImage, Flex, Skeleton, Text, TokenSymbolImage } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import Totem from './Totem'

const BarHeight = 50

const ContributionWrapper = styled.div<{ perc: number, index: number, selectable: boolean }>`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: ${({ perc }) => perc}%;
    height: ${BarHeight}px;
    z-index: ${({ index }) => 10 - index};
    ${({ theme, selectable }) => selectable && pressableMixin({
        theme,
        hoverStyles: css`
            .elev-highlight {
                transform: translateY(2px);
            }
        `,
    })}
`

const ContributionBaseHighlight = styled.div`
    position: absolute;
    opacity: 0.4;
    top: -22px;
    left: 0px;
    right: -1px;
    bottom: 0px;
    z-index: -1;
`
const ContributionGoldHighlight = styled(ContributionBaseHighlight)<{ perc: number }>`
    background-color: #FCC965;
    border-radius: 4px;
    bottom: ${({ perc }) => perc < 11 ? '-30' : '-10'}px;
`
const ContributionElevSelectedHighlight = styled(ContributionBaseHighlight)<{ elevation: string, first: boolean, last: boolean }>`
    background-color: ${({ theme, elevation }) => theme.colors[elevation]};
    border-radius: 0px;
    bottom: -50px;
    top: 25px;
    left: ${({ first }) => first ? 0 : -20}px;
    right: ${({ last }) => last ? 0 : -20}px;
    opacity: 0.15;
    ${({ first }) => !first && css`
        &:after {
            content: ' ';
            border: 0;
            position: absolute;
            left: 0px;
            width: 20px;
            bottom: 20px;
            top: 0px;
            border-radius: 0 0 20px 0;
            background: ${({ theme }) => theme.colors.background};
        }
    `}
    ${({ last }) => !last && css`
        &:before {
            content:' ';
            border: 0;
            position:absolute;
            right: 0px;
            width: 20px;
            bottom: 20px;
            top: 0px;
            border-radius: 0 0 0 20px;
            background: ${({ theme }) => theme.colors.background};
        }
    `}
`

const TitleWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 32px;
    width: 100%;
    flex-wrap: wrap;
`

const ValueText = styled(Text)<{ perc: number, index: number, isTotem?: boolean, isBonusVal?: boolean }>`
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    width: ${({ isTotem }) => isTotem ? '40px': 'auto'};
    flex-wrap: wrap;
    overflow: hidden;
    bottom: ${({ isBonusVal }) => isBonusVal ? -14 : 0}px;
    display: ${({ isBonusVal, perc }) => isBonusVal && perc < 20 ? 'none' : 'block'};
    text-align: center;
    transform: ${({ perc }) => perc < 20 ? 'rotate(70deg) translateX(25%)' : 'none'};
    
    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ isBonusVal, perc }) => isBonusVal && perc < 11 ? 'none' : 'block'};
        transform: ${({ perc }) => perc < 11 ? 'rotate(70deg) translateX(20%)' : 'none'};
    }
`

const LowPercHideText = styled(Text)<{ perc: number }>`
    display: ${({ perc }) => perc < 20 ? 'none' : 'flex'};

    ${({ theme }) => theme.mediaQueries.nav} {
        display: ${({ perc }) => perc < 10 ? 'none' : 'flex'};
    }
`

const VerticalBar = styled.div<{ perc: number, noContributions?: boolean }>`
    width: 1px;
    position: absolute;
    height: 20px;
    left: ${({ perc }) => perc}%;
    border-left: ${({ theme, noContributions }) => `1px ${noContributions === true ? 'dashed' : 'solid'} ${theme.colors.text}`};
    z-index: 11;
    pointer-events: none;
`
const HorizontalBar = styled.div<{ noContributions?: boolean }>`
    position: absolute;
    width: 100%;
    height: 1px;
    border-top: ${({ theme, noContributions }) => `1px ${noContributions === true ? 'dashed' : 'solid'} ${theme.colors.text}`};
    z-index: 11;
    pointer-events: none;
`

const Wrapper = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 6px;
`

const BarWrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 75px;
`

const NoBreakdownText = styled(Text)`
    background-color: ${({ theme }) => theme.colors.background};
    padding: 0px 6px;
    z-index: 2;
`

const ContributionSkeleton = styled(Skeleton)`
    position: relative;
    width: 100%;
    height: 4px;
    min-height: 4px;
`




interface Contribution {
    token?: boolean
    elevation?: boolean
    totem?: boolean
    title?: string
    val?: string
    bonusVal?: string
    key: number
    perc: number
    index?: number
    count?: number
    selectable?: boolean
    selectedIndex?: string
    onSelect?: (string?) => void
}

const TotemImage: React.FC<{ info: string }> = ({ info }) => {
    const [elevation, totem] = info.split('_')
    return (
        <Totem
            elevation={elevation as Elevation}
            totem={parseInt(totem)}
            color=''
            pressable={false}
            size='24'
            navSize='24'
        />
    )
}

const ContributionComponent: React.FC<Contribution> = ({token = false, elevation = false, totem=false, title, val, bonusVal, perc, index, count, selectable, selectedIndex, onSelect}) => {
    const totemWin = totem && !!parseInt(title.split('_')[2])
    const clickable = useMemo(
        () => selectable ? { onClick: () => onSelect(title === selectedIndex ? undefined : title) } : null,
        [selectable, title, selectedIndex, onSelect]
    )
    return <ContributionWrapper perc={perc} index={index} selectable={selectable} {...clickable} >
        { totemWin && <ContributionGoldHighlight perc={perc}/>}
        { title === selectedIndex && <ContributionElevSelectedHighlight elevation={title} first={index === 0} last={index === count - 1} className='elev-highlight'/>}
        {title != null && <TitleWrapper>
            { token && <TokenSymbolImage symbol={title} width={36} height={36} />}
            { elevation && <ElevationImage elevation={title} size={36} />}
            { totem && <TotemImage info={title}/> }
            { !totem && <LowPercHideText monospace perc={perc} lineHeight='14px' ml='4px' mr='4px' small textAlign='center'>{title}</LowPercHideText> }
        </TitleWrapper>}
        <VerticalBar perc={100}/>
        <ValueText monospace bold perc={perc} gold={totemWin} isTotem={totem} index={index}>{val != null ? val : `${perc.toFixed(1)}%`}</ValueText>
        { bonusVal != null && <ValueText monospace bold gold isBonusVal perc={perc} index={index}>{bonusVal}</ValueText> }
    </ContributionWrapper>
}

interface Props {
    loaded: boolean
    breakingDownTitle?: string
    breakdownType?: 'ELEVATION' | 'FARM' | 'TOTEM'
    contributions: Contribution[]
    selectable?: boolean
    selectedIndex?: string
    onSelect?: (string?) => void
}

const ContributionBreakdown: React.FC<Props> = ({loaded, breakingDownTitle, breakdownType = 'ELEVATION', contributions, selectable=false, selectedIndex, onSelect}) => {
    const noContributions = contributions.length === 0

    return (
        <Wrapper>
            { breakingDownTitle != null && breakdownType !== 'TOTEM' && <Text bold monospace>{breakingDownTitle} BY {breakdownType}:</Text> }
            <BarWrapper>
                { !loaded ?
                    <>
                        <ContributionSkeleton/>
                    </> :
                    <>
                        <VerticalBar perc={0} noContributions={noContributions}/>
                        <HorizontalBar noContributions={noContributions}/>
                        {noContributions ?
                            <>
                                <NoBreakdownText monospace>NOTHING TO BREAKDOWN</NoBreakdownText>
                                <VerticalBar perc={100} noContributions/>
                            </> :
                            contributions.map((contribution, index) => 
                                <ContributionComponent key={contribution.key} index={index} count={contributions.length} {...contribution} selectable={selectable} selectedIndex={selectedIndex} onSelect={onSelect} />
                            )
                        }
                    </>
                }
            </BarWrapper>
        </Wrapper>
    )
}

export default React.memo(ContributionBreakdown)
