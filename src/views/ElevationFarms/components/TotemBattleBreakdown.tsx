import React, { useCallback } from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import styled, { keyframes } from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { Text, Flex, useMatchBreakpoints } from 'uikit'
import Totem from './Totem'
import chroma from 'chroma-js'
import { clamp, chunk } from 'lodash'
import { pressableMixin } from 'uikit/util/styledMixins'

const TotemHeight = 64;
const GameAreaHeight = 150;

const TotemBattleAreaWrapper = styled(Flex)<{ fullWidth: boolean, secondRow: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${GameAreaHeight}px;
  margin-top: ${({ secondRow }) => secondRow ? -7 : 0}px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const ExpectedMultText = styled(Text)<{ invis?: boolean }>`
  font-size: 12px;
  width: 24px;
  opacity: ${({ invis }) => invis ? 0 : 1};
`

// const BattleText = styled.svg<{ elevation: Elevation }>`
//   position: absolute;
//   font-weight: 900;
//   opacity: 0.2;
//   /* font-size: 4.5vw; */
//   /* letter-spacing: 7px; */
//   transform: rotate(-8deg);
//   pointer-events: none;
//   & > .battle-svg-text {
//     letter-spacing: 2px;
//     fill: ${({ theme, elevation }) => theme.colors[elevation]};
//   }
// `

const TotemMultText = styled(Text)`
  pointer-events: none;
  border-radius: 4px;
  position: absolute;
  font-size: 12px;
  bottom: -18px;
  padding: 2px 4px;
  background-color: ${({ theme }) => theme.colors.background};
`

const TotemResultsWrapper = styled(Flex)<{ elevation: Elevation, multiElev: boolean }>`
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding-left: 6px;
  padding-right: 6px; 
  margin-left: 6px; 
  margin-right: 6px;
  gap: ${({ elevation }) => elevation === Elevation.SUMMIT || elevation === Elevation.MESA ? 5 : 20}px;
  flex: 1;

  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: center;
    gap: ${({ elevation }) => elevation === Elevation.SUMMIT ? 5 : 20}px;
    padding-left: ${({ multiElev}) => multiElev ? 32 : 6}px;
    padding-right: ${({ multiElev}) => multiElev ? 32 : 6}px; 
  }

  .rule-line:nth-child(even) {
    opacity: 0.08;
  }
  & > .rule-line {
    background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  }
  & > * > .selected-totem-indicator {
    background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  }
`

const TotemPosition = styled(Flex)<{ topOffset: number }>`
  margin-top: ${({ topOffset }) => topOffset}px;
  align-items: center;
  justify-content: center;
  position: relative;
`

const DashedLine = styled.div<{ rightClipped: boolean }>`
  position: absolute;
  left: 0px;
  right: ${({ rightClipped }) => rightClipped ? 28 : 0}px;
  border-top: 1px dashed ${({ theme }) => theme.colors.text};
`

const RuleLine = styled.div<{ index: number }>`
  position: absolute;
  left: 0px;
  right: 0px;
  top: ${({ index }) => (21.5 * index) + (TotemHeight / 2) - (21.5 * 1.5)}px;
  height: 21.5px;
  opacity: 0.16;
  border-radius: ${({ index }) => index === 0 ? '12px 12px 0px 0px' : index === 6 ? '0px 0px 12px 12px' : 'none'};
`

const ElevationIndicator = styled(Text)<{ elevation: Elevation }>`
  position: absolute;
  top: 0px;
  left: 12px;
  color: ${({ theme, elevation }) => theme.colors[elevation]};
`

const TotemScale = styled.div<{ scale: number }>`
  transform: scale(${({ scale }) => scale});
  transform-origin: center;
  position: relative;
`

const TotemBreakdownWrapper = styled.div<{ fullWidth: boolean, multiElev: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ multiElev }) => multiElev ? 0 : 24}px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const TotemResultWrapper = styled(Flex)<{ selected }>`
  flex-direction: column;
  position: relative;  
  height: 100%;
  ${({ theme, selected }) => !selected && pressableMixin({ theme })}
`

const PulseKeyframes = keyframes`
  0%: {
    height: 0%;
    opacity: 0.5;
  }
  50%, 100% {
    height: 100%;
    opacity: 0;
  }
`

const ArenaPulse = styled.div<{ elevation: Elevation }>`
  position: absolute;
  left: 0px;
  right: 0px;
  height: 1px; 
  opacity: 0.5;
  background-color: ${({ theme, elevation}) => theme.colors[elevation]};
  animation: ${PulseKeyframes} 4s infinite ease-out;
`

const RowCombinerRight = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.text};
  border-left: none;
  width: 32px;
  height: 85px;
  position: absolute;
  right: 0px;
  bottom: -10px;
  border-radius: 0px 32px 32px 0px;
`

const RowCombinerLeft = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.text};
  border-right: none;
  width: 32px;
  height: 83px;
  position: absolute;
  left: 0px;
  top: -8px;
  border-radius: 32px 0px 0px 32px;
`
const RowCombinerMid = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.colors.text};
  height: 1px;
  position: absolute;
  left: 32px;
  right: 32px;
  top: -8px;
`

const calcTopOffset = (mult, elevation: Elevation) => {
  const expectedMult = elevationUtils.totemCount(elevation)

  const thirdMult = expectedMult * 0.4
  const maxMult = expectedMult + thirdMult
  const minMult = expectedMult - thirdMult
  const clampedMult = clamp(mult == null ? expectedMult : mult, minMult, maxMult)
  return ((maxMult - clampedMult) / (maxMult - minMult)) * (GameAreaHeight - TotemHeight)
}
const calcScale = (mult, elevation: Elevation) => {
  const expectedMult = elevationUtils.totemCount(elevation)

  const thirdMult = expectedMult * 0.4
  const maxMult = expectedMult + thirdMult
  const minMult = expectedMult - thirdMult
  const clampedMult = clamp(mult == null ? expectedMult : mult, minMult, maxMult)
  return 1 - (((maxMult - clampedMult) / (maxMult - minMult)) * 0.1)
}


const RulerLine: React.FC<{ i: number }> = React.memo(({ i }) => {
  return (<RuleLine className='rule-line' index={i}/>)
})

const TotemBattleArea: React.FC<{ elevation: Elevation, fullWidth: boolean, secondRow: boolean, isMobile: boolean, multiElev: boolean }> = React.memo(({ elevation, children, fullWidth, secondRow, isMobile, multiElev }) => {
  const expectedMultiplier = elevationUtils.totemCount(elevation)
  return (
    <TotemBattleAreaWrapper fullWidth={fullWidth} secondRow={secondRow} className='totem-arena'>
      { !multiElev && <ExpectedMultText invis={secondRow} bold monospace>{expectedMultiplier}x</ExpectedMultText> }
      <TotemResultsWrapper elevation={elevation} multiElev={multiElev}>
        { !secondRow && <ElevationIndicator bold monospace elevation={elevation}>THE {elevation} BATTLE ARENA</ElevationIndicator> }
        <RulerLine i={0}/>
        <RulerLine i={1}/>
        <RulerLine i={2}/>
        <RulerLine i={3}/>
        <RulerLine i={4}/>
        <RulerLine i={5}/>
        <RulerLine i={6}/>
        <ArenaPulse elevation={elevation}/>
        {/* { !multiElev && !isMobile && <BattleText viewBox="0 0 250 50" elevation={elevation}>
          <text x='50%' y='50%' className='battle-svg-text' textAnchor='middle' dominantBaseline='middle'>{elevation} BATTLE ARENA</text>
        </BattleText> } */}
        <DashedLine rightClipped={elevation === Elevation.SUMMIT && !secondRow && isMobile && !multiElev}/>
        {children}
      </TotemResultsWrapper>
      { secondRow && <RowCombinerLeft/>}
      { secondRow && <RowCombinerMid/>}
      { elevation === Elevation.SUMMIT && !secondRow && isMobile && !multiElev && <RowCombinerRight/>}
    </TotemBattleAreaWrapper>
  )
})


const IconCrown = styled.div`
  position: absolute;
  top: -36px;
  right: -10px;
  width: 68px;
  height: 68px;
  transform: rotate(15deg);
  background-image: url('/images/totemIcons/ICONCROWN.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
  pointer-events: none;
`

const SelectedTotemIndicator = styled.div`
  position: absolute;
  left: -6px;
  right: -6px;
  top: 0px;
  bottom: 0px;
  opacity: 0.3;
`

interface TotemInfo {
  totem: number
  crowned: boolean
  mult: number
}


interface SelectTotemModalProps {
  elevation: Elevation
  preselectedTotem: number
}

interface TotemResultProps {
  totemInfo: TotemInfo
  elevation: Elevation
  color: string
  selected: boolean
  onPresentSelectTotemModal?: (props: SelectTotemModalProps) => void
}

const TotemBattleResult: React.FC<TotemResultProps> = ({ totemInfo, elevation, color, selected, onPresentSelectTotemModal }) => {
  const topOffset = calcTopOffset(totemInfo.mult, elevation)
  const totemScale = calcScale(totemInfo.mult, elevation)

  const handlePresentSelectTotemModal = useCallback(() => {
    if (selected || onPresentSelectTotemModal == null) return
    onPresentSelectTotemModal({
      elevation,
      preselectedTotem: totemInfo.totem
    })
  }, [totemInfo, selected, elevation, onPresentSelectTotemModal])
  return (
    <TotemResultWrapper selected={selected} onClick={handlePresentSelectTotemModal}>
      {selected && <SelectedTotemIndicator className='selected-totem-indicator' /> }
      <TotemPosition topOffset={topOffset}>
        <TotemMultText bold monospace>{totemInfo.mult == null ? '' : `${isFinite(totemInfo.mult) ? totemInfo.mult.toFixed(1) : 'INF '}x`}</TotemMultText>
        <TotemScale scale={totemScale}>
          <Totem
            elevation={elevation}
            totem={totemInfo.totem}
            color={color}
            pressable={false}
            selected={selected}
            size='46'
          />
          {totemInfo.crowned && <IconCrown />}
        </TotemScale>
      </TotemPosition>
    </TotemResultWrapper>
  )
}

interface Props {
  title?: string
  elevation: Elevation
  totemInfos: TotemInfo[]
  fullWidth?: boolean
  userTotem?: number
  userTotemCrowned?: boolean
  multiElev?: boolean
  onPresentSelectTotemModal?: (SelectTotemModalProps) => void
}

const TotemBattleBreakdown: React.FC<Props> = ({ title, elevation, totemInfos, userTotem, onPresentSelectTotemModal, fullWidth = true, multiElev = false }) => {
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(totemInfos.length)

  const { isXl } = useMatchBreakpoints();
  const isMobile = isXl === false;

  if (totemInfos.length === 0) return (
    <TotemBreakdownWrapper fullWidth={fullWidth} multiElev={multiElev}>
      { title != null && <Text bold monospace>{title}</Text> }
      <TotemBattleArea
        fullWidth={fullWidth}
        elevation={elevation}
        secondRow={false}
        isMobile={isMobile}
        multiElev={multiElev}
      >
        <TotemBattleResult
          totemInfo={{ totem: null, crowned: false, mult: elevationUtils.totemCount(elevation) }}
          elevation={elevation}
          color={colorGradient[0]}
          selected={false}
        />
      </TotemBattleArea>
    </TotemBreakdownWrapper>
  )

  const chunkedTotems = chunk(totemInfos, isMobile ? 5 : 10)

  return (
    <>
    { chunkedTotems.map((totems, chunkIndex) =>
      <TotemBreakdownWrapper fullWidth={fullWidth} key={totems[0].totem} multiElev={multiElev}>
        <TotemBattleArea
          fullWidth={fullWidth}
          elevation={elevation}
          secondRow={chunkIndex === 1}
          isMobile={isMobile}
          multiElev={multiElev}
        >
          {totems.map((totemInfo) => (
            <TotemBattleResult
              key={totemInfo.totem}
              totemInfo={totemInfo}
              elevation={elevation}
              color={colorGradient[totemInfo.totem]}
              selected={totemInfo.totem === userTotem}
              onPresentSelectTotemModal={onPresentSelectTotemModal}
            />
          ))}
        </TotemBattleArea>
      </TotemBreakdownWrapper>
    )}
    </>
  )
}

export default React.memo(TotemBattleBreakdown)
