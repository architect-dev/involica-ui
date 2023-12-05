import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { TextWithChanged } from '@uikit'
import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'

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
	leftBlend?: boolean
	rightBlend?: boolean
	changed?: boolean
	width?: string
}

const NumericInput: React.FC<NumericInputProps> = ({
	onChange,
	onFocus,
	value,
	endText,
	disabled = false,
	invalid = false,
	leftBlend = false,
	rightBlend = false,
	changed,
	width,
	...rest
}) => {
	return (
		<StyledNumericInput width={width}>
			<StyledInputWrapper disabled={disabled} invalid={invalid} leftBlend={leftBlend} rightBlend={rightBlend}>
				<InputWrapper>
					<StyledInput disabled={disabled} value={value} onChange={onChange} onFocus={onFocus} invalid={invalid} {...rest} />
				</InputWrapper>
				{endText != null && (
					<TextWithChanged small italic red={invalid} changed={changed} asterisk buttonText>
						{endText}
					</TextWithChanged>
				)}
			</StyledInputWrapper>
		</StyledNumericInput>
	)
}

const StyledNumericInput = styled.div<{ width?: string }>`
	position: relative;
	width: ${({ width }) => width ?? '100px'};
`

const StyledInputWrapper = styled(SelectorWrapperBase)<{ leftBlend: boolean; rightBlend: boolean }>`
	position: relative;
	align-items: center;

	border-radius: ${({ leftBlend, rightBlend }) => `${leftBlend ? '0' : '16px'} ${rightBlend ? '0 0' : '16px 16px'} ${leftBlend ? '0' : '16px'}`};
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

  ${({ theme }) => grainyGradientMixin(!theme.isDark)}
`

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	z-index: 2;
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
	color: ${({ theme, invalid }) => (invalid ? theme.colors.failure : theme.colors.buttonText)};

	::placeholder {
		color: ${({ theme, invalid }) => transparentize(0.5, invalid ? theme.colors.failure : theme.colors.buttonText)};
	}
`

export default NumericInput
