import React, { useMemo } from 'react'
import styled from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

const buttonHeight = 28

type SelectorWrapperProps = {
  buttonWidth: number
  optionCount: number
  selectedIndex: number | null
}
const SelectorWrapper = styled(SelectorWrapperBase)<SelectorWrapperProps>`
  display: flex;
  justify-content: center;
  height: ${buttonHeight}px;
  width: ${({ buttonWidth, optionCount }) => buttonWidth * optionCount};
  border-radius: 22px;
  position: relative;

  .selectedButton {
    width: ${({ buttonWidth }) => buttonWidth}px;
    left: ${({ buttonWidth, selectedIndex }) => (selectedIndex ?? 0) * buttonWidth}px;
  }
  .textButton {
    width: ${({ buttonWidth }) => buttonWidth}px;
  }
`

const SelectedSummitButton = styled(SummitButton)<{ selectedIndex: number }>`
  pointer-events: none;
  position: absolute;
  top: 0px;
  height: ${buttonHeight}px;
  max-height: ${buttonHeight}px;
  min-height: ${buttonHeight}px;
  z-index: 3;
  font-size: 14px;
  cursor: default;
`

const TextButton = styled.div<{ selected: boolean }>`
  cursor: pointer;
  color: ${({ theme, selected }) => (selected ? 'transparent' : theme.colors.text)};
  font-family: Courier Prime, monospace;
  font-size: 14px;
  height: ${buttonHeight}px;
  line-height: ${buttonHeight}px;
  text-align: center;

  ${pressableMixin};

  cursor: ${({ selected }) => (selected ? 'default' : 'pointer')};
`

interface Option {
  value: string
  label: string
}
interface Props {
  buttonWidth: number
  options: Option[]
  selected: string
  select: (value: string) => void
}

const OptionSelector: React.FC<Props> = ({ buttonWidth, options, selected, select }) => {
  const selectedIndex = useMemo(() => {
    return options.findIndex((option) => option.value === selected)
  }, [options, selected])
  const selectedOption = useMemo(() => {
    return options[selectedIndex]
  }, [options, selectedIndex])

  return (
    <SelectorWrapper buttonWidth={buttonWidth} optionCount={options.length} selectedIndex={selectedIndex}>
      {selectedIndex !== -1 && (
        <SelectedSummitButton className="selectedButton" selectedIndex={selectedIndex} padding="0px">
          {selectedOption.label}
        </SelectedSummitButton>
      )}
      {options.map((option, index) => (
        <TextButton
          key={option.label}
          className="textButton"
          onClick={() => select(option.value)}
          selected={selectedIndex === index}
        >
          {option.label}
        </TextButton>
      ))}
    </SelectorWrapper>
  )
}

export default React.memo(OptionSelector)
