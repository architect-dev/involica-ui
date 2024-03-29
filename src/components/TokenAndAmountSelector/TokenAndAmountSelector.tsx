import React, { useCallback, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Column, Text } from '@uikit'
import { TokenSelectButton } from '@components/TokenSelect/TokenSelectButton'
import { AddressRecord, Token } from '@state/types'
import { useTokenOrNativeFullData } from '@state/hooks'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { Nullable, bn, bnDisplay, toFixedMaxPrecision } from '@utils'
import { grainyGradientMixin, pressableMixin } from '@uikit/util/styledMixins'
import { transparentize } from 'polished'
import { TokenIndicator } from '@components/TokenSelect/TokenIndicator'
import { getNativeTokenSymbol } from '@config/constants'

const StyledInputWrapper = styled(SelectorWrapperBase)`
	position: relative;
	align-items: center;

	border-radius: 16px;
	outline: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.text)};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	max-width: 320px;

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

  ${({ theme }) => grainyGradientMixin(theme.isDark)}
`

const ThinRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	height: 24px;
	width: 100%;
	padding: 0 16px;
	gap: 16px;
	z-index: 2;
`
const BalanceRow = styled(ThinRow)`
	justify-content: space-between;
`
const InputRow = styled(ThinRow)`
	height: 52px;
	border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.text)};
	border-left-width: 0px;
	border-right-width: 0px;
	justify-content: space-between;
	padding: 0px 12px;
`

const InputWrapper = styled.div<{ changed?: boolean }>`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	position: relative;
	height: 28px;

	${({ changed, theme }) =>
		changed &&
		css`
			:after {
				content: '*';
				color: ${theme.colors.warning};
				font-size: 14px;
				font-weight: bold;
				position: absolute;
				top: -4px;
				right: -8px;
			}
		`}
`

export const StyledInput = styled.input<{ invalid?: boolean }>`
	width: 100%;
	background: none;
	border: 0;
	font-size: 20px;
	font-weight: bold;
	font-style: italic;
	padding-right: 30px;
	flex: 1;
	margin: 0;
	padding: 0;
	outline: none;
	text-align: right;
	letter-spacing: 1px;
	color: ${({ theme, invalid }) => (invalid ? theme.colors.failure : theme.colors.text)};
	::placeholder {
		color: ${({ theme, invalid }) => transparentize(0.5, invalid ? theme.colors.failure : theme.colors.text)};
	}
`

const TextButton = styled.div<{ buttonText?: boolean }>`
	cursor: pointer;
	font-size: 14px;
	line-height: 24px;
	cursor: pointer;
	padding: 0px 8px;
	margin: 0px -8px;
	color: ${({ theme, buttonText }) => (buttonText ? theme.colors.buttonText : theme.colors.text)};

	${pressableMixin};

	&:hover {
		font-weight: bold;
		text-decoration: underline;
	}
`

interface TokenInputProps {
	token: Nullable<string>
	setToken?: (token: string) => void
	value: Nullable<string>
	setValue: (val: string, max: string, token: Token) => void

	disabledReasons?: AddressRecord<string>

	placeholder?: string
	disabled?: boolean
	isLocked?: boolean
	invalidReason: Nullable<string>

	tokenChanged?: boolean
	amountChanged?: boolean

	tokenSelectDisabled?: boolean

	max: Nullable<string>

	balanceText?: string
	isNativeDeposit?: boolean
}

const TokenAndAmountSelector: React.FC<TokenInputProps> = ({
	token,
	setToken,
	value,
	setValue,

	disabledReasons,

	placeholder = '0.0',
	disabled,
	isLocked,
	invalidReason,

	tokenChanged,
	amountChanged,

	tokenSelectDisabled,
	max,

	balanceText = 'Balance',
	isNativeDeposit = false,
}) => {
	const { data: tokenData, userData: tokenUserData } = useTokenOrNativeFullData(token)

	const fullBalance = useMemo(() => max ?? bnDisplay(tokenUserData?.balance, tokenData?.decimals), [max, tokenData?.decimals, tokenUserData?.balance])

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (fullBalance == null || tokenData == null) return
			setValue(e.currentTarget.value, fullBalance, tokenData)
		},
		[setValue, fullBalance, tokenData]
	)

	// If full balance or token changes, call handleChange to update error
	useEffect(() => {
		if (value == null || fullBalance == null || tokenData == null) return
		setValue(value, fullBalance, tokenData)
	}, [fullBalance, value, setValue, tokenData])

	const handleSelect10Native = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		setValue('10', fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const handleSelect20Native = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		setValue('20', fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const handleSelect1Perc = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		const value = toFixedMaxPrecision(bn(fullBalance).div(100).toString(), tokenData?.decimals)
		if (value == null) return
		setValue(value, fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const handleSelect5Perc = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		const value = toFixedMaxPrecision(bn(fullBalance).div(20).toString(), tokenData?.decimals)
		if (value == null) return
		setValue(value, fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const handleSelect10Perc = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		const value = toFixedMaxPrecision(bn(fullBalance).div(10).toString(), tokenData?.decimals)
		if (value == null) return
		setValue(value, fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const handleSelect50Perc = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		const value = toFixedMaxPrecision(bn(fullBalance).div(2).toString(), tokenData?.decimals)
		if (value == null) return
		setValue(value, fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const handleSelectMax = useCallback(() => {
		if (fullBalance == null || tokenData == null) return
		setValue(fullBalance, fullBalance, tokenData)
	}, [setValue, fullBalance, tokenData])

	const valUsd = useMemo(() => {
		if (tokenData?.price == null || value == null || value === '') return '-'
		return `$${bn(value).times(tokenData.price).toFixed(2)}`
	}, [tokenData, value])

	return (
		<Column width='100%' maxWidth='320px' gap='4px'>
			<StyledInputWrapper disabled={disabled} isLocked={isLocked} invalid={invalidReason != null}>
				<ThinRow>
					{isNativeDeposit ? (
						<>
							<TextButton onClick={handleSelect10Native}>10 {getNativeTokenSymbol()}</TextButton>
							<TextButton onClick={handleSelect20Native}>20 {getNativeTokenSymbol()}</TextButton>
						</>
					) : (
						<>
							<TextButton onClick={handleSelect1Perc}>1%</TextButton>
							<TextButton onClick={handleSelect5Perc}>5%</TextButton>
							<TextButton onClick={handleSelect10Perc}>10%</TextButton>
							<TextButton onClick={handleSelect50Perc}>50%</TextButton>
							<TextButton onClick={handleSelectMax}>MAX</TextButton>
						</>
					)}
				</ThinRow>
				<InputRow>
					{tokenSelectDisabled ? (
						<TokenIndicator token={token} />
					) : (
						<TokenSelectButton
							token={token}
							setToken={setToken}
							noTokenString='select'
							disabledTokens={disabledReasons}
							modalVariant='tokenIn'
							changed={tokenChanged}
						/>
					)}
					<Column alignItems='flex-end'>
						<InputWrapper changed={amountChanged}>
							<StyledInput
								disabled={disabled || isLocked}
								placeholder={placeholder}
								value={value ?? ''}
								onChange={handleChange}
								invalid={invalidReason != null}
							/>
						</InputWrapper>
						<Text small italic lineHeight='14px'>
							{valUsd}
						</Text>
					</Column>
				</InputRow>
				<BalanceRow>
					<Text>{balanceText}:</Text>
					<Text>{fullBalance != null ? parseFloat(fullBalance).toFixed(4) : '-'}</Text>
				</BalanceRow>
			</StyledInputWrapper>

			{invalidReason != null && (
				<Text red italic small>
					{invalidReason}
				</Text>
			)}
		</Column>
	)
}

export default TokenAndAmountSelector
