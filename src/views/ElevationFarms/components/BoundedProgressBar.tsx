import { Elevation } from 'config/constants'
import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { Flex, HeaderInfoQuestion, Text, TooltipModalType, TriangleGrowIcon, useModal } from 'uikit'
import { useSelectedElevation } from 'state/hooks'
import TooltipModal from 'uikit/widgets/Modal/TooltipModal'
import { MarkProp } from 'uikit/components/Svg/Icons/TriangleGrow'
import { pressableMixin } from 'uikit/util/styledMixins'

const EndMarkerHeight = 55

const EndMarkerWrapper = styled.div<{ positionPerc: number }>`
    position: absolute;
    display: flex;
    justify-content: center;
    width: 1px;
    left: ${({ positionPerc }) => `calc(${positionPerc}% - 1px)`};
    height: ${EndMarkerHeight}px;
`

const MarkerWrapper = styled.div<{ positionPerc: number }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1px;
    height: ${EndMarkerHeight}px;
    left: ${({ positionPerc }) => (positionPerc) - 100}%;
`

const EndMarkerText = styled(Text)<{ top: boolean }>`
    position: absolute;
    font-size: ${({ top }) => top ? 11 : 12}px;
    line-height: 18px;
    white-space: nowrap;
    top: ${({ top }) => top ? 0 : EndMarkerHeight - 18}px;
    bottom: ${({ top }) => top ? EndMarkerHeight - 18 : 0}px;
`

const MarkerText = styled(Text)`
    position: absolute;
    font-size: 13px;
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
    top: ${EndMarkerHeight - 18}px;
    bottom: 0px;
    background-color: ${({ theme }) => theme.colors.cardHover};
    transition: background-color 250ms;
`

const MarkerBar = styled.div<{ elevation?: Elevation }>`
    width: 4px;
    position: absolute;
    height: 24px;
    left: -2px;
    background-color: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
`

const VerticalBar = styled.div`
    width: 2px;
    position: absolute;
    top: 20px;
    bottom: 20px;
    background-color: ${({ theme }) => theme.colors.text};
`

const BarFlex = styled(Flex)<{ single: boolean }>`
    position: relative;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 40px);

    ${({ single }) => single ? css`
        margin-left: 10px;
        margin-right: 10px;
        align-items: flex-start;
    ` : css`
        min-width: 135px;
    `}
`

const Wrapper = styled(Flex)<{ single: boolean }>`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: ${({ single }) => single ? 0 : 1};
    max-width: 350px;
`

const StyledTriangleGrowIcon = styled(TriangleGrowIcon)<{ elevation?: Elevation }>`
    > .progress-fill {
        fill: ${({ theme, elevation }) => darken(0.1, theme.colors[elevation || 'BASE'])};
    }
`

const PressableFlex = styled(Flex)`
    cursor: pointer;
    ${pressableMixin}    
`

interface Props {
    title: string
    marks: EndMarkerProps[]
    currDisplayPerc?: number
    currPositionPerc?: number
    tooltipType: TooltipModalType
}

interface EndMarkerProps {
    title?: string
    displayPerc: number
    positionPerc: number
}

interface MarkerProps {
    displayPerc: number
    positionPerc: number
    elevation?: Elevation
}

const EndMarker: React.FC<EndMarkerProps> = ({title, displayPerc, positionPerc}) => {
    return <EndMarkerWrapper positionPerc={positionPerc}>
        {title != null && <EndMarkerText monospace top>{title}</EndMarkerText>}
        <VerticalBar/>
        {displayPerc != null && <EndMarkerText monospace top={false}>{displayPerc}%</EndMarkerText>}
    </EndMarkerWrapper>
}

const Marker: React.FC<MarkerProps> = ({displayPerc, positionPerc, elevation}) => {
    return <MarkerWrapper positionPerc={positionPerc}>
        {displayPerc != null && <MarkerText className='marker-text' monospace bold>{displayPerc}%</MarkerText>}
        <MarkerBar elevation={elevation}/>
    </MarkerWrapper>
}

const BoundedProgressBar: React.FC<Props> = ({title, marks, currDisplayPerc, currPositionPerc, tooltipType}) => {
    const elevation = useSelectedElevation()

    const single = marks.length <= 1

    const [onPresentTooltipModal] = useModal(
        <TooltipModal tooltipType={tooltipType}/>
    ) 

    const handlePresentTooltipModal = useCallback(
        (e) => {
            e.stopPropagation()
            onPresentTooltipModal()
        },
        [onPresentTooltipModal]
    )

    return (
        <Wrapper single={single}>
            <PressableFlex alignItems='center' justifyContent='center' width='100%' pl='24px' pr='24px' gap='8px' onClick={handlePresentTooltipModal}>
                <Text bold monospace small textAlign='center' lineHeight='14px'>
                    {title}: {currDisplayPerc}%
                </Text>
                <HeaderInfoQuestion/>
            </PressableFlex>
            <BarFlex flexDirection='row' alignItems='center' single={single}>
                { !single && <StyledTriangleGrowIcon
                    width='100%'
                    height='15px'
                    elevation={elevation}
                    currDisplayPerc={currDisplayPerc}
                    currPositionPerc={currPositionPerc}
                    marks={marks as MarkProp[]}
                /> }
                { !single && marks.map((mark) =>
                    <EndMarker key={mark.positionPerc} {...mark}/>
                )}
                <Marker displayPerc={currDisplayPerc} positionPerc={currPositionPerc} elevation={elevation}/>
            </BarFlex>
        </Wrapper>
    )
}

export default React.memo(BoundedProgressBar)
