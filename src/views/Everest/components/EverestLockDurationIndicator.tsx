import React from 'react'
import { Flex } from 'uikit'
import Slider from 'rc-slider'
import styled from 'styled-components'
import { linearGradient } from 'polished'
import 'rc-slider/assets/index.css'
import { getPaletteGradientStops, getLockDurationPerc, lockDurationSliderMarks, sliderPoints  } from 'utils'
import { SummitPalette } from 'config/constants'

const ButtonHeight = 6

const SliderWrapper = styled(Flex)`
    position: relative;
    width: calc(100% - 48px);
    margin-top: 28px;
    margin-bottom: 26px;
    pointer-events: none;

    .rc-slider-rail {
        border-radius: 0px;
        width: 100%;
        left: 0px;
        height: ${ButtonHeight}px;
        top: ${(ButtonHeight / -2) + 6}px;
        background-color: ${({ theme }) => theme.colors.text};
        opacity: 0.3;
    }
    .rc-slider-track {
        top: 3px;
        border-radius: 0px;
        height: ${ButtonHeight}px;
        background: ${linearGradient({
            colorStops: getPaletteGradientStops(SummitPalette.EVEREST),
            toDirection: '120deg',
        })};
    }
    .rc-slider-dot {
        display: none;        
    }
    .rc-slider-dot-active {
        border-color: none;
    }

    .rc-slider-handle {
        width: ${ButtonHeight - 4}px;
        height: ${ButtonHeight - 4}px;
        padding: 0px;
        border: none;
        margin-top: -${(ButtonHeight / 2) - 3}px;
        background: transparent;
        z-index: 5;
    }
    .rc-slider-handle:hover {
        box-shadow: none;
    }
    .rc-slider-handle:active {
        box-shadow: none;
    }

    .rc-slider-mark {
        top: -24px;
        pointer-events: none;
    }
    .rc-slider-mark-text {
        color: ${({ theme }) => theme.colors.text};
        font-family: Courier Prime, monospace;
        letter-spacing: 0.5px;
        font-weight: bold;
        font-weight: 13px;
        pointer-events: none;
    }



    .slider-mark-text {
        font-size: 12px;
        line-height: 1.5;
        font-family: Courier Prime, monospace;
        letter-spacing: 0.5px;
        color: ${({ theme }) => theme.colors.text};
    }

    .lock-mult {
        margin-top: 24px;
    }
`

const FakeMarkDot = styled.div<{ perc: number }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: 32px;
    height: 64px;
    margin-left: -16px;
    top: -26px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 4;

    &::after {
        position: absolute;
        content: ' ';
        width: 2px;
        height: 15px;
        background-color: ${({ theme }) => theme.colors.text};
    }
`

const FakeSliderHandle = styled.div<{ perc: number }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: 4px;
    height: 24px;
    padding: 0px;
    border: none;
    pointer-events: none;

    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    margin-top: -6px;
    z-index: 6;
    background-color: #D9B28B;
`

interface Props {
    avgLockDuration: number | null
}

const EverestLockDurationIndicator: React.FC<Props> = ({ avgLockDuration }) => {
    const marks = lockDurationSliderMarks()
    const avgPerc = getLockDurationPerc(avgLockDuration)
    const filterPercs = [0, 3, 8].map((index) => index * (100 / (sliderPoints.length - 1)))

    const filteredMarks = {
        [filterPercs[0]]: marks[filterPercs[0]],
        [filterPercs[1]]: marks[filterPercs[1]],
        [filterPercs[2]]: marks[filterPercs[2]],
    }

    return (
        <SliderWrapper>
            <Slider
                min={0}
                marks={filteredMarks}
                step={1}
                value={avgPerc}
                defaultValue={avgPerc}
            />
            { Object.keys(filteredMarks).map((markPerc) =>
                <FakeMarkDot
                    key={markPerc}
                    perc={parseFloat(markPerc)}
                />
            )}
            { avgPerc != null &&
                <FakeSliderHandle perc={avgPerc}/>
            }
        </SliderWrapper>
    )
}

export default EverestLockDurationIndicator