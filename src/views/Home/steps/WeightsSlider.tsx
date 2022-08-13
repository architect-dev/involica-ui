import React, { useCallback, useMemo } from 'react'
import { usePositionConfigState } from './introStore'
import { transparentize } from 'polished'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styled from 'styled-components'
import { Row, Text, TokenSymbolImage } from 'uikit'
import { getSymbol } from 'config/symbols'

const SliderWrapper = styled.div`
  height: 60px;
  display: flex;
  width: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
`

const WeightsRow = styled(Row)`
  height: 100%;
  align-items: center;
  pointer-events: none;
  position: absolute;
  top: 0;
`

const Bound = styled.div`
  width: 0px;
  height: 24px;
  position: relative;
  z-index: 2;
  pointer-events: none;
  ::after {
    position: absolute;
    content: ' ';
    left: -2px;
    width: 4px;
    height: 24px;
    background-color: ${({ theme }) => theme.colors.text};
    margin-top: 0px;
  }
`

const EmptySlider = styled.div`
  width: 100%;
  height: 24px;
`

const WeightIndicator = styled.div<{ weight: number }>`
  width: ${({ weight }) => weight}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`

const StyledSlider = styled(Slider)`
  margin-left: 4px;
  margin-right: 4px;
  .rc-slider-rail {
    width: calc(100% + 4px);
    margin-left: -2px;
    border-radius: 0px;
    background-color: ${({ theme }) => transparentize(0.7, theme.colors.text)};
  }
  .rc-slider-handle {
    width: 4px;
    height: 24px;
    border-radius: 0;
    border-color: ${({ theme }) => theme.colors.text};
    margin-top: -10px;
    opacity: 1;
    position: absolute;
    ::after {
      position: absolute;
      left: -8px;
      right: -8px;
      top: -4px;
      bottom: -4px;
      content: ' ';
    }
    &:hover {
      border-color: ${({ theme }) => theme.colors.text};
    }
  }
  .rc-slider-handle-dragging {
    border-color: ${({ theme }) => theme.colors.text} !important;
    box-shadow: 0 0 0 5px
      ${({ theme }) => transparentize(0.7, theme.colors.text)} !important;
  }
`

export const WeightsSlider: React.FC = () => {
  const outs = usePositionConfigState((state) => state.outs)
  const updateWeights = usePositionConfigState((state) => state.updateWeights)

  const weightValues = useMemo(() => {
    const weights = []
    let running = 0
    outs.slice(0, -1).forEach((out) => {
      weights.push(running + out.weight)
      running += out.weight
    })
    return weights
  }, [outs])

  const handleUpdateWeights = useCallback(
    (valuesRaw: number | number[]) => {
      const values = [].concat(valuesRaw)
      let prev = 0
      const ws = values.map((value) => {
        const tmp = value - prev
        prev = value
        return tmp
      }).concat(100 - prev)
      updateWeights(ws)
    },
    [updateWeights],
  )

  console.log({
    outs,
  })

  return (
    <SliderWrapper>
      <WeightsRow>
        <Bound/>
        {outs.length === 0 && <EmptySlider/>}
        {outs.map((out) => (
          <WeightIndicator weight={out.weight}>
            <TokenSymbolImage symbol={getSymbol(out.token)} width={24} height={24}/>
            <Text>{out.weight}%</Text>
          </WeightIndicator>
        ))}
        <Bound/>
      </WeightsRow>
      <StyledSlider
        range
        min={1}
        max={99}
        count={Math.max(0, weightValues.length - 1)}
        value={weightValues}
        onChange={handleUpdateWeights}
        trackStyle={{ backgroundColor: 'transparent' }}
        pushable
      />
    </SliderWrapper>
  )
}
