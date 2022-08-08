import React, { useCallback } from 'react'
import styled from 'styled-components'
import { linearGradient } from 'polished'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import { useSelectedElevation } from 'state/hooks'
import { Elevation, RoundLockTime, SummitPalette } from 'config/constants'
import { getPaletteGradientStops, getTimeRemainingText } from 'utils'
import { clamp } from 'lodash'
import { Spinner, SpinnerKeyframes } from 'uikit/components/Svg/Icons/Spinner'
import { RoundStatus, useElevationRoundStatusAndProgress } from 'state/hooksNew'

const RoundProgressBar = styled(Flex)`
    position: relative;
    align-items: center;
    justify-content: center;
    margin-top: 36px;
    margin-bottom: 24px;
    flex: 1;
    max-width: 600px;
`

const ProgressBarText = styled(Text)`
    position: absolute;
    top: -36px;
`

const HorizontalBar = styled.div`
    position: absolute;
    width: 100%;
    height: 6px;
    background-color: ${({ theme }) => theme.colors.text};
`

const VerticalBar = styled.div<{ right?: boolean, isExpedition: boolean, isUnlockBar: boolean }>`
    position: absolute;
    height: 15px;
    width: 2px;
    z-index: 4;
    
    right: ${({ right }) => right ? '0px' : 'unset'};
    left: ${({ right }) => right ? 'unset' : '0px'};
    background-color: ${({ right, isExpedition, theme, isUnlockBar }) => ((!right && !isUnlockBar) || (right && isUnlockBar)) ?
        (isExpedition ? '#3B2F60' : theme.colors.textGold) :
        theme.colors.text
    };
`

const ProgressBar = styled.div<{ perc: number, isExpedition: boolean, isUnlockBar: boolean }>`
    width: ${({ perc, isUnlockBar }) => isUnlockBar ? (100 - perc) : perc}%;
    height: 6px;
    background-color: ${({ isExpedition, isUnlockBar }) => linearGradient({
    colorStops: getPaletteGradientStops(isExpedition ? SummitPalette.EXPEDITION : SummitPalette.GOLD),
    toDirection: (isUnlockBar !== isExpedition) ? '120deg' : '-60deg',
})};
    z-index: 3;
    position: absolute;
    left: ${({ isUnlockBar }) => isUnlockBar ? 'unset' : '0px'};
    right: ${({ isUnlockBar }) => isUnlockBar ? '0px' : 'unlock'};
`

const ProgressPill = styled.div<{ perc: number, isExpedition: boolean }>`
    width: 4px;
    height: 24px;
    background-color: ${({ isExpedition }) => isExpedition ? '#DDA4A8' : '#FCC965'};
    position: absolute;
    left: ${({ perc }) => `calc(${perc}% - 2px)`};
    z-index: 4;
`

const TextBubble = styled.div<{ perc: number, isExpedition: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 16px;
    background-color: ${({ theme }) => theme.colors.card};
    border-radius: 4px;
    z-index: 3;
    position: absolute;
    left: ${({ perc }) => `clamp(36px, ${perc}%, calc(100% - 36px))`};
    transform: translateX(-50%) translateY(50%);
    bottom: -30px;
    white-space: nowrap;

    ${({ theme }) => theme.mediaQueries.nav} {
        left: ${({ perc }) => `calc(${perc}% - 2px)`};
    }

    .spinner {
        fill: ${({ isExpedition }) => isExpedition ? '#d89595' : '#f2ac4a'};
        stroke: ${({ isExpedition }) => isExpedition ? '#d89595' : '#f2ac4a'};
        stroke-width: 2px;
        animation: ${SpinnerKeyframes} 1.4s infinite linear;
        margin-right: 18px;
    }
`

const TimerText = styled(Text) <{ evenGrowHighlight: boolean, endingHighlight: boolean, isExpedition: boolean }>`
    transform-origin: 50% 50%;
    transform: ${({ evenGrowHighlight }) => `scale(${(evenGrowHighlight) ? 1.07 : 1})`};
    color: ${({ theme, endingHighlight, evenGrowHighlight, isExpedition }) => (endingHighlight && evenGrowHighlight) ? (isExpedition ? '#d89595' : '#f2ac4a') : theme.colors.text};
`

const StyledSpinner = styled(Spinner)`
    width: 14px;
    height: 14px;
`

const ElevationRoundProgress: React.FC = () => {
    const selectedElevation = useSelectedElevation()
    const isExpedition = selectedElevation === Elevation.EXPEDITION

    const { status, duration, timeRemaining } = useElevationRoundStatusAndProgress(isExpedition ? Elevation.EXPEDITION : Elevation.PLAINS)
    const isUnlockBar = status === RoundStatus.NotYetUnlocked

    const getRoundProgressUI = useCallback(
        () => {
            let timerText = ''
            let nearLockHighlight = true
            const durationToLock = duration - RoundLockTime
            const timeToLock = timeRemaining - RoundLockTime
            let pillPerc = clamp((100 * (durationToLock - timeToLock)) / durationToLock, 0, 100)
            let evenGrowHighlight = false
            let textPerc = 50
            if (status === RoundStatus.SummitNotYetEnabled) {
                nearLockHighlight = false
                timerText = 'ROUND: NOT YET ENABLED'
                pillPerc = 0
            } else if (isUnlockBar) {
                nearLockHighlight = false
                timerText = `${isExpedition ? 'THE EXPEDITION' : 'YIELD WARS'} UNLOCKS IN: ${getTimeRemainingText(timeRemaining)}`
            } else {
                // eslint-disable-next-line no-lonely-if
                if (timeRemaining == null) {
                    timerText = ''
                    nearLockHighlight = false
                } else if (timeRemaining === 0) {
                    timerText = 'FINALIZING ROUND'
                    evenGrowHighlight = true
                } else if (timeRemaining <= RoundLockTime) {
                    timerText = `LOCKED, FINALIZING IN: ${getTimeRemainingText(timeRemaining)}`
                    evenGrowHighlight = true
                } else if (timeRemaining <= (RoundLockTime + 300)) {
                    timerText = `ROUND LOCKS IN: ${getTimeRemainingText(timeToLock)}!`
                    evenGrowHighlight = timeRemaining % 2 === 0
                } else {
                    timerText = getTimeRemainingText(timeToLock)
                    textPerc = pillPerc
                    nearLockHighlight = false
                }
            }

            return {
                timerText,
                nearLockHighlight,
                pillPerc,
                textPerc,
                evenGrowHighlight
            }

        },
        [status, timeRemaining, isUnlockBar, duration, isExpedition]
    )

    const {
        timerText,
        nearLockHighlight,
        pillPerc,
        textPerc,
        evenGrowHighlight,
    } = getRoundProgressUI()

    return (
        <Flex alignItems='flex-start' justifyContent='center' width='100%' gap='48px' pl='8px' pr='8px'>
            <RoundProgressBar>
                <ProgressBarText bold monospace>
                    { isExpedition ? 'EXPEDITION TIMER' : 'YIELD WARS TIMER'}:
                </ProgressBarText>
                <HorizontalBar />
                <VerticalBar isExpedition={isExpedition} isUnlockBar={isUnlockBar} />
                <VerticalBar isExpedition={isExpedition} isUnlockBar={isUnlockBar} right />
                <ProgressBar isExpedition={isExpedition} perc={pillPerc} isUnlockBar={isUnlockBar} />
                <ProgressPill isExpedition={isExpedition} perc={pillPerc} />
                {timeRemaining != null && <TextBubble isExpedition={isExpedition} perc={textPerc}>
                    {timeRemaining === 0 && status !== RoundStatus.SummitNotYetEnabled && <StyledSpinner className="spinner" />}
                    <TimerText
                        isExpedition={isExpedition}
                        bold
                        monospace
                        endingHighlight={nearLockHighlight}
                        evenGrowHighlight={evenGrowHighlight}
                    >
                        {timerText}
                    </TimerText>
                </TextBubble>}
            </RoundProgressBar>
        </Flex>
    )
}

export default React.memo(ElevationRoundProgress)
