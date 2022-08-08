import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'uikit'
import { getEpochTimestamps, getPaletteGradientStops, getTimeRemainingText, timestampToDate } from 'utils'
import { useEpochVariableTickTimestamp } from 'state/hooks'
import { linearGradient } from 'polished'
import { SummitPalette } from 'config/constants'

const EndMarkerHeight = 65

const EndMarkerWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    width: 1px;
    height: ${EndMarkerHeight}px;
`

const MarkerWrapper = styled.div<{ progress: number }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1px;
    height: ${EndMarkerHeight}px;
    left: ${({ progress }) => (progress * 100) - 100}%;
`

const EndMarkerText = styled(Text)`
    position: absolute;
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
    top: ${-4}px;
`

const MarkerText = styled(Text)`
    position: absolute;
    font-size: 14px;
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
    bottom: -4px;
    white-space: nowrap;
`

const MarkerBar = styled.div`
    width: 4px;
    position: absolute;
    height: 24px;
    left: 0px;
    background-color: #94BDCC;
    z-index: 5;
`

const VerticalBar = styled.div`
    width: 2px;
    position: absolute;
    top: 25px;
    bottom: 25px;
    z-index: 4;
    background-color: ${({ theme }) => theme.colors.text};
`

const BarFlex = styled(Flex)`
    position: relative;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    flex: 1;
    min-width: 100px;
`
const HorizontalBar = styled.div`
    width: 100%;
    height: 6px;
    background-color: ${({ theme }) => theme.colors.text};
    opacity: 0.3;
`

const HorizontalProgressBar = styled.div<{ progress: number }>`
    position: absolute;
    left: 0;
    width: ${({ progress }) => progress * 100}%;
    height: 6px;
    background: ${linearGradient({
        colorStops: getPaletteGradientStops(SummitPalette.BASE),
        toDirection: '120deg',
    })};`

const Wrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 450px;
`

interface Props {
    epoch: number
    isCurrentEpoch?: boolean
}

interface EndMarkerProps {
    title?: string
    perc?: number
}

interface MarkerProps {
    timeRemainingText: string
    progress: number
}

const EndMarker: React.FC<EndMarkerProps> = ({title, perc}) => {
    return <EndMarkerWrapper>
        {title != null && <EndMarkerText monospace>{title}</EndMarkerText>}
        <VerticalBar/>
        {perc != null && <EndMarkerText monospace bold={false}>{perc}%</EndMarkerText>}
    </EndMarkerWrapper>
}

const Marker: React.FC<MarkerProps> = ({timeRemainingText, progress}) => {
    return <MarkerWrapper progress={progress}>
        <MarkerText monospace bold>{timeRemainingText}</MarkerText>
        <MarkerBar/>
    </MarkerWrapper>
}

const EpochProgressBar: React.FC<Props> = ({ epoch, isCurrentEpoch = false }) => {
    const { beginTimestamp, closeTimestamp, thawTimestamp } = getEpochTimestamps(epoch)
    const startTimestamp = isCurrentEpoch ? beginTimestamp : closeTimestamp
    const endTimestamp = isCurrentEpoch ? closeTimestamp : thawTimestamp
    const startDate = timestampToDate(startTimestamp)
    const endDate = timestampToDate(endTimestamp)
    const currentTimestamp = useEpochVariableTickTimestamp(epoch, isCurrentEpoch)
    const timeRemainingText = getTimeRemainingText(Math.max(0, endTimestamp - currentTimestamp))
    const progress = (currentTimestamp - startTimestamp) / (endTimestamp - startTimestamp)
    return (
        <Wrapper>
            <BarFlex flexDirection='row' alignItems='center'>
                <EndMarker title={startDate}/>
                <HorizontalBar/>
                <HorizontalProgressBar progress={progress}/>
                <EndMarker title={endDate}/>
                <Marker timeRemainingText={timeRemainingText} progress={progress}/>
            </BarFlex>
        </Wrapper>
    )
}

export default React.memo(EpochProgressBar)
