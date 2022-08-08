import React from 'react'
import { ElevOrPalette } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { HighlightedText, Lock } from 'uikit'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  tokenSymbol?: string
  placeholder?: string
  startAdornment?: React.ReactNode
  value: string
  summitPalette?: ElevOrPalette
  disabled?: boolean
  isLocked?: boolean
}

const Input: React.FC<InputProps> = ({
  tokenSymbol,
  endAdornment,
  onChange,
  placeholder,
  startAdornment,
  value,
  disabled = false,
  isLocked = false,
}) => {
  return (
    <StyledInputWrapper disabled={disabled} isLocked={isLocked}>
      {!!startAdornment && startAdornment}
      <InputWrapper>
        <StyledInput
          disabled={disabled || isLocked}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {!!tokenSymbol && <SymbolText fontSize='12px' monospace>{tokenSymbol}</SymbolText>}
      </InputWrapper>
      {!!endAdornment && endAdornment}
      {isLocked && <StyledLock width="28px" />}
    </StyledInputWrapper>
  )
}

const StyledInputWrapper = styled(SelectorWrapperBase)`
  position: relative;
  align-items: center;

  border-radius: 16px;
  display: flex;
  height: 62px;
  padding: 0 ${(props) => props.theme.spacing[3]}px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}

  ${({ isLocked }) =>
    isLocked &&
    css`
      filter: grayscale(1);
      opacity: 0.5;
    `}
`

const StyledLock = styled(Lock)`
  position: absolute;
  transform: rotate(20deg);
  fill: white;
  filter: drop-shadow(1px 1px 4px black);
  z-index: 4;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const SymbolText = styled(HighlightedText)`
  text-shadow: none;
`

export const StyledInput = styled.input<{ summitPalette?: ElevOrPalette }>`
  width: 100%;
  background: none;
  border: 0;
  font-size: 22px;
  font-weight: bold;
  font-style: italic;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
`

export default Input
