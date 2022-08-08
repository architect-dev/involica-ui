import React, { useState, useCallback } from 'react'
import Slider from 'rc-slider'
import styled from 'styled-components'
import { linearGradient } from 'polished'
import 'rc-slider/assets/index.css'
import { pressableMixin } from 'uikit/util/styledMixins'
import { getPaletteGradientStops, lockDurationSliderMarks, lockDurationSliderPerc, sliderPercLockDuration } from 'utils'
import { SummitPalette } from 'config/constants'
import { selectorWrapperMixin } from 'uikit/widgets/Selector/styles'
import { Flex } from 'uikit/components/Box'

const ButtonHeight = 28

const SliderWrapper = styled(Flex)`
    position: relative;
    width: calc(100% - ${ButtonHeight}px);
    margin-top: 28px;
    margin-bottom: 26px;

    .rc-slider-rail {
        width: calc(100% + ${ButtonHeight}px);
        left: -${ButtonHeight / 2}px;
        height: ${ButtonHeight}px;
        border-radius: ${ButtonHeight / 2}px;
        top: ${(ButtonHeight / -2) + 6}px;
        ${selectorWrapperMixin}
    }
    .rc-slider-track {
        display: none;
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
        top: -26px;
        pointer-events: none;
    }
    .rc-slider-mark-text {
        color: ${({ theme }) => theme.colors.text};
        font-family: Courier Prime, monospace;
        letter-spacing: 0.5px;
        pointer-events: none;
        font-size: 13px;
    }

    .slider-mark-text {
        font-size: 12px;
        line-height: 1.5;
        font-family: Courier Prime, monospace;
        letter-spacing: 0.5px;
        color: ${({ theme }) => theme.colors.text};
    }

    .lock-mult {
        margin-top: 36px;
        transform: rotate(30deg);
    }
`

const FakeMarkDot = styled.div<{ perc: number, disabled: boolean }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: 32px;
    height: 64px;
    margin-left: -16px;
    top: -26px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    ${pressableMixin}

    &::after {
        position: absolute;
        border-radius: 4px;
        content: ' ';
        width: 6px;
        height: 6px;
        background-color: ${({ theme }) => theme.colors.text};
        box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
    }
`

const FakeSliderHandle = styled.div<{ perc: number }>`
    position: absolute;
    left: ${({ perc }) => perc}%;
    width: ${ButtonHeight - 4}px;
    height: ${ButtonHeight - 4}px;
    padding: 0px;
    border: none;
    pointer-events: none;
    margin-top: -6px;
    margin-left: -12px;
    z-index: 6;
    box-shadow: ${({ theme }) => `3px 3px 6px ${theme.colors.textShadow}`} !important;
    background: ${linearGradient({
        colorStops: getPaletteGradientStops(SummitPalette.EVEREST),
        toDirection: '120deg',
    })};
    border-radius: 20px;
`

interface Props {
    minLockDuration?: number
    existingLockDuration: number | null
    setLockDuration: (number) => void
}

const EverestLockDurationSlider: React.FC<Props> = ({ minLockDuration = 0, existingLockDuration, setLockDuration }) => {
    const existingDurPerc = existingLockDuration != null ? lockDurationSliderPerc(existingLockDuration) : null
    const minDurLockPerc = lockDurationSliderPerc(minLockDuration)
    const marks = lockDurationSliderMarks(minLockDuration, existingLockDuration)
    const [perc, setPerc] = useState(existingLockDuration != null ? existingDurPerc : lockDurationSliderPerc(30))


    const handleSetLockDuration = useCallback((markPerc) => {
        const clampedPerc = Math.max(markPerc, Math.max(minDurLockPerc, existingDurPerc))
        setPerc(clampedPerc)
        setLockDuration(sliderPercLockDuration(clampedPerc))
    }, [existingDurPerc, minDurLockPerc, setPerc, setLockDuration])

    return (
        <SliderWrapper>
            <Slider
                min={0}
                marks={marks}
                step={null}
                onChange={handleSetLockDuration}
                value={perc}
                defaultValue={perc}
            />
            { Object.keys(marks).map((markPerc) =>
                <FakeMarkDot
                    key={markPerc}
                    perc={parseFloat(markPerc)}
                    disabled={parseFloat(markPerc) < Math.max(minDurLockPerc, existingDurPerc)}
                    onClick={() => handleSetLockDuration(markPerc)}
                />
            )}
            { perc != null &&
                <FakeSliderHandle
                    perc={perc}
                />
            }
        </SliderWrapper>
    )
}

export default EverestLockDurationSlider