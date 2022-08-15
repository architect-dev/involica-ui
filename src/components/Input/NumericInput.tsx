import React from 'react'
import styled, { css } from 'styled-components'
import { Text } from 'uikit'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'

interface NumericInputProps {
  value: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  onFocus?: () => void
  endText?: string
  disabled?: boolean
  invalid?: boolean
  placeholder?: string
  min?: string
  max?: string
  step?: string
}

const NumericInput: React.FC<NumericInputProps> = ({
  onChange,
  onFocus,
  value,
  endText,
  disabled = false,
  invalid = false,
  ...rest
}) => {

  return (
    <StyledNumericInput>
      <StyledInputWrapper disabled={disabled}>
        <InputWrapper>
          <StyledInput
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            invalid={invalid}
            {...rest}
          />
        </InputWrapper>
        {endText != null &&
          <Text small italic>{endText}</Text>
        }
      </StyledInputWrapper>
    </StyledNumericInput>
  )
}

const StyledNumericInput = styled.div`
  position: relative;
  width: 120px;
`


const StyledInputWrapper = styled(SelectorWrapperBase)`
  position: relative;
  align-items: center;

  border-radius: 16px;
  display: flex;
  height: 28px;
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

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

export const StyledInput = styled.input<{ invalid?: boolean }>`
  width: 100%;
  background: none;
  border: 0;
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
  color: ${({ theme, invalid }) => invalid ? theme.colors.failure : theme.colors.text};
`

export default NumericInput
