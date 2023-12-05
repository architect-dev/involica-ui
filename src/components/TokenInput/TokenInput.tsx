import React, { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js/bignumber'
import TextInput, { InputProps } from '../Input'
import { Text, SummitButton } from '@uikit'
import { Dots } from '@uikit/components/Dots'

interface TokenInputProps extends InputProps {
	max: number | string | undefined
	symbol: string
	onSelectMax?: () => void
	balanceText?: string
	feeText?: string
	feeBP?: number
	disabled?: boolean
	isLocked?: boolean
	invalid?: boolean
	presetValue?: string
	onSelectPreset?: () => void
}

const TokenInput: React.FC<TokenInputProps> = ({
	balanceText = 'Balance',
	max,
	symbol,
	onChange,
	onSelectMax,
	value,
	feeText = 'Fee',
	feeBP = 0,
	disabled = false,
	isLocked = false,
	invalid = false,
	presetValue,
	onSelectPreset,
}) => {
	const feeToTake = useMemo(() => (feeBP > 0 ? new BigNumber(value || 0).times(feeBP / 10000).toNumber() : 0), [value, feeBP])

	return (
		<StyledTokenInput>
			<StyledMaxText bold monospace>
				{balanceText}: {max == null ? <Dots /> : parseFloat(max.toLocaleString()).toFixed(3)} {symbol}
			</StyledMaxText>
			<TextInput
				disabled={disabled}
				tokenSymbol={symbol}
				isLocked={isLocked}
				endAdornment={
					<StyledTokenAdornmentWrapper>
						<StyledSpacer />
						{presetValue != null && (
							<div>
								<SummitButton activeText={presetValue} disabled={disabled || isLocked} padding='12px' mr='6px' onClick={onSelectPreset} />
							</div>
						)}
						<div>
							<SummitButton activeText='Max' disabled={disabled || isLocked} padding='12px' onClick={onSelectMax} />
						</div>
					</StyledTokenAdornmentWrapper>
				}
				onChange={onChange}
				placeholder='0'
				value={value}
				invalid={invalid}
			/>
			{feeBP > 0 ? (
				<StyledFeeText monospace red={feeToTake > 0}>
					{feeText}: {feeToTake.toFixed(4)}
				</StyledFeeText>
			) : null}
		</StyledTokenInput>
	)
}

const StyledTokenInput = styled.div`
	position: relative;
	width: 100%;
	max-width: 300px;
`

const StyledSpacer = styled.div`
	width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
	align-items: center;
	display: flex;
`

const StyledMaxText = styled(Text)<{ red?: boolean }>`
	align-items: center;
	color: ${({ theme, red }) => (red ? theme.colors.failure : theme.colors.text)};
	display: flex;
	font-style: italic;
	margin-right: 16px;
	font-size: 12px;
	font-weight: 700;
	height: 32px;
	letter-spacing: 0.15px;
	justify-content: flex-start;
`

const StyledFeeText = styled(StyledMaxText)`
	position: absolute;
	left: 0px;
	bottom: -30px;
`

export default TokenInput
