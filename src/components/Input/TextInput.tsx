import React from 'react'
import styled, { css } from 'styled-components'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'

export interface InputProps {
	onChange: (e: React.FormEvent<HTMLInputElement>) => void
	placeholder?: string
	value: string
	preset: boolean
	multiline: boolean
}

const TextInput: React.FC<InputProps> = ({ onChange, placeholder, value, preset, multiline }) => {
	return (
		<StyledTextInputWrapper preset={preset} multiline={multiline}>
			<InputWrapper>
				<StyledTextInput
					as={multiline ? 'textarea' : 'input'}
					disabled={preset}
					multiline={multiline}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
			</InputWrapper>
		</StyledTextInputWrapper>
	)
}

const StyledTextInputWrapper = styled(SelectorWrapperBase)<{ preset: boolean; multiline: boolean }>`
	position: relative;
	align-items: center;

	border-radius: 12px;
	display: flex;
	flex: 1;
	height: ${({ multiline }) => (multiline ? 68 : 36)}px;

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

  ${({ preset }) =>
		preset
			? css`
					pointer-events: none;
					box-shadow: none;
			  `
			: css`
					background-color: ${({ theme }) => theme.colors.background};
			  `}
`

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
`

export const StyledTextInput = styled.input<{ multiline: boolean }>`
	width: 100%;
	background: none;
	border: 0;
	font-size: 12px;
	font-weight: bold;
	flex-wrap: wrap;
	flex: 1;
	height: ${({ multiline }) => (multiline ? 68 : 36)}px;
	min-height: ${({ multiline }) => (multiline ? 68 : 36)}px;
	max-height: ${({ multiline }) => (multiline ? 68 : 36)}px;
	resize: both;
	margin: 0;
	resize: none;
	padding: 6px 12px;
	outline: none;
	color: ${({ theme }) => theme.colors.text};
`

export default TextInput
