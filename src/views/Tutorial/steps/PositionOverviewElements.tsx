import { linearGradient, transparentize } from 'polished'
import React, { useMemo } from 'react'
import { PositionOut } from '@state/types'
import { useInvolicaStore } from '@state/store'
import styled from 'styled-components'
import { TokenSymbolImage, Text, Column, Row } from '@uikit'
import { bn, bnDisplay, eN } from '@utils'
import { ethers } from 'ethers'
import { usePositionAmountDCA, usePositionIntervalDCA, usePositionOuts, usePositionTokenInWithData } from '@state/hooks'
import { useIntervalStrings } from '@state/uiHooks'

const SwapRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start:
  justify-content: flex-start;
  padding: 0 24px;
  background: ${({ theme }) =>
		linearGradient({
			colorStops: [transparentize(1, theme.colors.text), transparentize(0.8, theme.colors.text), transparentize(1, theme.colors.text)],
			toDirection: 'to right',
		})};
`

const TokenRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
`

const TextWrap = styled.div`
	display: flex;
	flex: 1;
	min-width: 120px;
	width: min-content;
`

const InColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	padding: 12px;
`

const OutsColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	padding: 12px;
	padding-left: 0px;
	gap: 6px;
`

const EmptySymbolImage = styled(Text)`
	width: 22px;
	height: 22px;
	border-radius: 12px;
	line-height: 22px;
	text-align: center;
	background-color: white;
`

const WidthText = styled(Text)<{ width: string }>`
	width: ${({ width }) => width};
`

const OutIndicator: React.FC<{ out: PositionOut }> = ({ out }) => {
	const outData = useInvolicaStore((state) => state.tokens?.[out.token])
	return (
		<TokenRow>
			<Text small>
				<pre>{'     >     '}</pre>
			</Text>
			<WidthText bold width='25px'>
				{out.weight}%
			</WidthText>
			<TokenSymbolImage symbol={outData?.symbol} width={24} height={24} />
			<Text>{outData?.symbol}</Text>
		</TokenRow>
	)
}

const EmptyOutIndicator: React.FC = () => (
	<TokenRow>
		<Text small>
			<pre>{'     >     '}</pre>
		</Text>
		<WidthText bold width='25px'>
			-%
		</WidthText>
		<EmptySymbolImage>?</EmptySymbolImage>
		<Text>----</Text>
	</TokenRow>
)

export const PositionSwapsOverview: React.FC = () => {
	const { outs } = usePositionOuts()
	return <PositionSwapsOverviewOverride outs={outs} />
}
export const PositionSwapsOverviewOverride: React.FC<{
	outs: PositionOut[]
}> = ({ outs }) => {
	const { tokenIn, tokenInData } = usePositionTokenInWithData()
	const { amountDCA } = usePositionAmountDCA()
	const { intervalStringly } = useIntervalStrings()

	const sortedOuts = [...outs].sort((a, b) => (a.weight > b.weight ? -1 : 1))

	return (
		<SwapRow>
			<InColumn>
				<TokenRow>
					<Text bold>{amountDCA == null ? '-' : bnDisplay(amountDCA, 0, 3)}</Text>
					{tokenIn ? <TokenSymbolImage symbol={tokenInData?.symbol} width={24} height={24} /> : <EmptySymbolImage>?</EmptySymbolImage>}
					<Text>{tokenIn ? tokenInData?.symbol : '----'}</Text>
				</TokenRow>
				<TextWrap>
					<Text small italic>
						{intervalStringly}
					</Text>
				</TextWrap>
			</InColumn>
			<OutsColumn>
				{outs.length === 0 && (
					<>
						<EmptyOutIndicator key='0' />
						<EmptyOutIndicator key='1' />
					</>
				)}
				{sortedOuts.map((out) => (
					<OutIndicator key={out.token} out={out} />
				))}
			</OutsColumn>
		</SwapRow>
	)
}

export const PositionExpectedAndDurationOverview: React.FC = () => {
	const { tokenInData, tokenInUserData } = usePositionTokenInWithData()
	const { amountDCA } = usePositionAmountDCA()
	const { intervalDCA } = usePositionIntervalDCA()

	const [allowance, allowanceDCAs, balance, balanceDCAs, balanceLimited, limitedDCAs] = useMemo(() => {
		const b = bnDisplay(tokenInUserData?.balance, tokenInData?.decimals, 3)
		const infAllowance = bn(tokenInUserData?.allowance).gt(bn(ethers.constants.MaxUint256.div(2).toString()))
		const a = infAllowance ? 'Inf' : bnDisplay(tokenInUserData?.allowance, tokenInData?.decimals, 3)
		const bDCAs = Math.floor(bn(tokenInUserData?.balance).div(eN(amountDCA, tokenInData?.decimals)).toNumber())
		const bLimited = bn(tokenInUserData?.balance).lt(tokenInUserData?.allowance)
		if (amountDCA === '' || amountDCA === '0' || isNaN(parseFloat(amountDCA))) return [a, 0, b, 0, bLimited, 0]
		const aDCAs = infAllowance ? 'Inf' : Math.floor(bn(tokenInUserData?.allowance).div(eN(amountDCA, tokenInData?.decimals)).toNumber())
		return [a, aDCAs, b, bDCAs, bLimited, (bLimited ? bDCAs : aDCAs) as number]
	}, [amountDCA, tokenInData?.decimals, tokenInUserData?.allowance, tokenInUserData?.balance])

	const approxDuration = useMemo(() => {
		if (intervalDCA == null) return '-'
		if (intervalDCA * limitedDCAs > 3600 * 24 * 28) return `${((intervalDCA * limitedDCAs) / (3600 * 24 * 28)).toFixed(1)} months`
		if (intervalDCA * limitedDCAs > 3600 * 24 * 7) return `${((intervalDCA * limitedDCAs) / (3600 * 24 * 7)).toFixed(1)} weeks`
		if (intervalDCA * limitedDCAs > 3600 * 24) return `${((intervalDCA * limitedDCAs) / (3600 * 24)).toFixed(1)} days`
		if (intervalDCA * limitedDCAs > 3600) return `${((intervalDCA * limitedDCAs) / 3600).toFixed(1)} hours`
		return '1 hour'
	}, [intervalDCA, limitedDCAs])

	const totalAmountDcaUsd = useMemo(() => {
		if (limitedDCAs === 0 || amountDCA === '' || amountDCA === '0' || isNaN(parseFloat(amountDCA)) || tokenInData?.price == null) return '-'
		return bnDisplay(bn(amountDCA).times(limitedDCAs).times(tokenInData?.price), 0, 2)
	}, [amountDCA, limitedDCAs, tokenInData?.price])

	return (
		<SwapRow>
			<Column gap='24px' p='24px 12px'>
				<Row gap='48px'>
					<Text bold={!balanceLimited}>
						<u>Allowance:</u>
						<br />
						{allowance} {tokenInData?.symbol}
						<br />({allowanceDCAs} DCAs)
					</Text>
					<Text bold={balanceLimited}>
						<u>Balance:</u>
						<br />
						{balance} {tokenInData?.symbol}
						<br />({balanceDCAs} DCAs)
					</Text>
				</Row>
				<Text bold>
					<u>Expected:</u> {balanceLimited ? balanceDCAs : allowanceDCAs} DCAs (${totalAmountDcaUsd}) before {balanceLimited ? 'Balance' : 'Allowance'} runs out
					<br />
					<u>Duration:</u> {balanceLimited ? balanceDCAs : allowanceDCAs} DCAs will take approx. {approxDuration}
				</Text>
			</Column>
		</SwapRow>
	)
}
