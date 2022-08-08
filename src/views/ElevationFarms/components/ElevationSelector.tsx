import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Flex, Lock } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { darken } from 'polished'
import { Elevation, elevationUtils } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonWidth = 85
const buttonWidthVertical = 140
const buttonHeight = 28

const SelectorFlex = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const SelectorWrapper = styled(SelectorWrapperBase)<{
  elevationsCount: number
  vertical: boolean
  desktopOnlyVertical: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: ${buttonHeight + 4}px;
  width: ${({ elevationsCount }) => buttonWidth * elevationsCount}px;
  border-radius: 16px;
  position: relative;

  ${({ vertical, elevationsCount }) =>
    vertical &&
    css`
      flex-direction: column;
      height: ${elevationsCount * buttonHeight + 4}px;
      width: ${buttonWidthVertical}px;
    `}

  ${({ desktopOnlyVertical, elevationsCount }) =>
    desktopOnlyVertical &&
    css`
      ${({ theme }) => theme.mediaQueries.nav} {
        flex-direction: column;
        height: ${elevationsCount * buttonHeight + 4}px;
        width: ${buttonWidthVertical}px;
      }
    `}
`

const SelectedSummitButton = styled(SummitButton)<{
  selectedIndex: number
  vertical: boolean
  desktopOnlyVertical: boolean
}>`
  pointer-events: none;
  position: absolute;
  top: 2px;
  height: 28px;
  width: ${buttonWidth - 4}px;
  left: ${({ selectedIndex }) => selectedIndex * buttonWidth + 2}px;
  top: 2px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 4px;

  ${({ vertical, selectedIndex }) =>
    vertical &&
    css`
      width: ${buttonWidthVertical - 4}px;
      left: 2px;
      top: ${selectedIndex * buttonHeight + 2}px;
    `}

  ${({ desktopOnlyVertical, selectedIndex }) =>
    desktopOnlyVertical &&
    css`
      ${({ theme }) => theme.mediaQueries.nav} {
        width: ${buttonWidthVertical - 4}px;
        left: 2px;
        top: ${selectedIndex * buttonHeight + 2}px;
      }
    `}
`



const StyledLock = styled(Lock)<{ elevation?: Elevation }>`
  transform: rotate(20deg);
  fill: ${({ theme, elevation }) => elevation == null ? 'white' : darken(0.2, theme.colors[elevation])};
  width: 16px;
  height: 16px;
  margin-left: 4px;
`

const TextButton = styled.div<{
  elevation: Elevation
  disabled: boolean
  vertical: boolean
  desktopOnlyVertical: boolean
}>`
  width: ${buttonWidth}px;
  color: ${({ theme, elevation }) => darken(0.2, theme.colors[elevation])};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  ${({ theme, disabled }) =>
    pressableMixin({
      theme,
      disabled,
      disabledStyles: css`
        text-shadow: none;
        text-decoration: line-through;
      `,
    })}

  ${({ vertical }) =>
    vertical &&
    css`
      width: ${buttonWidthVertical}px;
    `}

  ${({ desktopOnlyVertical }) =>
    desktopOnlyVertical &&
    css`
      ${({ theme }) => theme.mediaQueries.nav} {
        width: ${buttonWidthVertical}px;
      }
    `}
`

interface Props {
  selected: Elevation
  vertical?: boolean
  desktopOnlyVertical?: boolean
  disabled?: boolean
  elevations: Elevation[]
  lockedElevations: boolean[]
  selectElevation: (elevation: Elevation) => void
}

const FarmTypeSelector: React.FC<Props> = ({
  selected,
  vertical = false,
  desktopOnlyVertical = false,
  disabled = false,
  elevations,
  lockedElevations = [],
  selectElevation,
}) => {
  const selectedIndex = elevations.findIndex((elevation) => elevation === selected)
  const handleSelectElevation = useCallback((elevation) => {
    if (disabled) return
    selectElevation(elevation)
  }, [disabled, selectElevation])

  return (
    <SelectorFlex>
      <SelectorWrapper
        elevationsCount={elevations.length}
        disabled={disabled}
        vertical={vertical}
        desktopOnlyVertical={desktopOnlyVertical}
      >
        {selected != null && (
          <SelectedSummitButton
            summitPalette={selected}
            selectedIndex={selectedIndex}
            vertical={vertical}
            disabled={disabled}
            desktopOnlyVertical={desktopOnlyVertical}
            padding="0px"
          >
            {selected}
            { lockedElevations[elevationUtils.toInt(selected)] && <StyledLock/> }
          </SelectedSummitButton>
        )}
        {elevations.map((elevation) => {
          return (
            <TextButton
              key={elevation}
              elevation={elevation}
              disabled={disabled}
              vertical={vertical}
              desktopOnlyVertical={desktopOnlyVertical}
              onClick={() => handleSelectElevation(elevation)}
            >
              {elevation}
              { lockedElevations[elevationUtils.toInt(elevation)] && <StyledLock elevation={elevation}/> }
            </TextButton>
          )
        })}
      </SelectorWrapper>
    </SelectorFlex>
  )
}

export default React.memo(FarmTypeSelector)
