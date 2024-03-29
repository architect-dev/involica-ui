import React, { useMemo } from 'react'
import { Card } from '@components/Card'
import styled from 'styled-components'
import { Column, Text, RowCenter, SummitButton, TextButton, TextWithChanged } from '@uikit'
import TokenAndAmountSelector from '@components/TokenAndAmountSelector'
import {
	useConfigurableAmountDCA,
	useConfigurableTokenIn,
	usePositionIntervalDCA,
	usePositionMaxGasPrice,
	usePositionOuts,
	usePositionTokenInWithData,
	useRevertIntervalAndMaxGasPrice,
	useRevertOuts,
	useRevertTokenAndAmount,
} from '@state/hooks'
import { IntervalSelector } from '@components/IntervalSelector'
import { CellCol, CellWithChanged } from './styles'
import { EditMaxGasPriceButton } from '@components/EditMaxGasPriceModal'
import { suffix, useIntervalStrings } from '@state/uiHooks'
import { OutsSelectionAndWeights } from '@components/Outs/OutsSelectionAndWeights'
import { RotateCcw } from 'react-feather'
import { getSymbol } from '@config/tokens'
import { ManagePositionButton } from '@components/ManagePositionModal'
import { useSetPosition } from '@hooks/useExecute'
import { useInvolicaStore } from '@state/store'
import { DataRow } from '@uikit/components/DataRow'
import { bn, eN } from '@utils'

const CellRow = styled.div`
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	gap: 18px;
	flex-wrap: wrap;
`

const StyledTextButton = styled(TextButton)`
	position: absolute;
	top: 6px;
	right: 14px;
	padding: 0;
`

const RevertChangesButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
	return (
		<StyledTextButton onClick={onClick}>
			<RotateCcw size={14} />
		</StyledTextButton>
	)
}

const StyledDataRow = styled(DataRow)`
	margin-top: -18px;
	max-width: 320px;
	padding: 0 12px 0 16px;
`

const TokenInCell: React.FC = () => {
	const { dirty: tokenInDirty, tokenIn, setTokenIn } = useConfigurableTokenIn()
	const { tokenInData, tokenInUserData } = usePositionTokenInWithData()
	const { outs } = usePositionOuts()
	const { dirty: amountDCADirty, amountDCA, setAmountDCA, amountDCAInvalidReason } = useConfigurableAmountDCA()
	const revertTokenAndAmount = useRevertTokenAndAmount()

	const disabledReasons = useMemo(() => {
		const reasons: Record<string, string> = {}
		if (tokenIn != null) reasons[tokenIn] = 'Selected'
		;(outs ?? []).forEach((out) => {
			reasons[out.token] = 'Used as DCA out'
		})
		return reasons
	}, [outs, tokenIn])

	const balanceDCAs = useMemo(() => {
		if (tokenInUserData?.balance == null) return null
		if (tokenInData?.decimals == null) return null
		if (amountDCA === '' || amountDCA == null || isNaN(parseFloat(amountDCA)) || parseFloat(amountDCA) === 0) return null
		return Math.floor(bn(tokenInUserData?.balance).div(eN(amountDCA, tokenInData?.decimals)).toNumber())
	}, [amountDCA, tokenInData?.decimals, tokenInUserData?.balance])

	return (
		<CellWithChanged changed={tokenInDirty || amountDCADirty} error={amountDCAInvalidReason != null}>
			<TextWithChanged small italic changed={tokenInDirty || amountDCADirty}>
				DCA Token and DCA Amount:
			</TextWithChanged>
			<TokenAndAmountSelector
				token={tokenIn}
				setToken={setTokenIn}
				value={amountDCA}
				setValue={setAmountDCA}
				disabledReasons={disabledReasons}
				tokenChanged={tokenInDirty}
				amountChanged={amountDCADirty}
				invalidReason={amountDCAInvalidReason}
				max={null}
			/>
			<StyledDataRow t='DCAs covered by Balance' v={balanceDCAs != null && !isNaN(balanceDCAs) ? `${balanceDCAs} DCAs` : '-'} />

			{(tokenInDirty || amountDCADirty) && <RevertChangesButton onClick={revertTokenAndAmount} />}
		</CellWithChanged>
	)
}

const OptionsCell: React.FC = () => {
	const { dirty: intervalDirty, intervalDCA } = usePositionIntervalDCA()
	const intervalInvalid = useMemo(() => intervalDCA == null || intervalDCA === 0, [intervalDCA])
	const { dirty: maxGasPriceDirty } = usePositionMaxGasPrice()
	const { intervalStringly } = useIntervalStrings()
	const revertIntervalAndMaxGasPrice = useRevertIntervalAndMaxGasPrice()

	return (
		<CellWithChanged changed={intervalDirty || maxGasPriceDirty} error={intervalInvalid}>
			<TextWithChanged small italic changed={intervalDirty || maxGasPriceDirty}>
				DCA Options:
			</TextWithChanged>
			<Column width='100%' gap='4px'>
				<DataRow
					t={
						<TextWithChanged small italic changed={intervalDirty} asterisk>
							Interval:
						</TextWithChanged>
					}
					v={
						<TextWithChanged bold changed={intervalDirty} asterisk>
							{intervalStringly}
						</TextWithChanged>
					}
				/>
				<IntervalSelector />
			</Column>
			<DataRow
				t={
					<TextWithChanged small italic changed={maxGasPriceDirty} asterisk>
						Max Gas Price:
					</TextWithChanged>
				}
				v={<EditMaxGasPriceButton />}
			/>

			{(intervalDirty || maxGasPriceDirty) && <RevertChangesButton onClick={revertIntervalAndMaxGasPrice} />}
		</CellWithChanged>
	)
}

const OutsCell: React.FC = () => {
	const { dirty, outs } = usePositionOuts()
	const outsInvalid = useMemo(() => outs == null || outs.length === 0, [outs])
	const revertOuts = useRevertOuts()
	return (
		<CellWithChanged changed={dirty} error={outsInvalid}>
			<TextWithChanged small italic changed={dirty}>
				DCA Portfolio: (Select up to 8 tokens)
			</TextWithChanged>
			<OutsSelectionAndWeights />

			{dirty && <RevertChangesButton onClick={revertOuts} />}
		</CellWithChanged>
	)
}

const ActionsCell: React.FC = () => {
	const { dirty: tokenInDirty, current: tokenInCurrent, tokenIn: tokenInPending } = useConfigurableTokenIn()
	const { dirty: outsDirty } = usePositionOuts()
	const { dirty: intervalDirty, current: intervalCurrent, intervalDCA: intervalPending } = usePositionIntervalDCA()
	const { dirty: maxGasPriceDirty, current: maxGasPriceCurrent, maxGasPrice: maxGasPricePending } = usePositionMaxGasPrice()
	const { dirty: amountDCADirty, current: dcaAmountCurrent, amountDCA: dcaAmountPending } = useConfigurableAmountDCA()

	const anyDirty = useMemo(
		() => outsDirty || intervalDirty || maxGasPriceDirty || tokenInDirty || amountDCADirty,
		[outsDirty, intervalDirty, maxGasPriceDirty, tokenInDirty, amountDCADirty]
	)

	const { amountDCAInvalidReason, intervalDCA, outs } = useInvolicaStore((state) => ({
		amountDCAInvalidReason: state.config.amountDCAInvalidReason,
		intervalDCA: state.config.intervalDCA,
		outs: state.config.outs,
	}))
	const intervalDCAInvalid = useMemo(() => intervalDCA == null || intervalDCA === 0, [intervalDCA])
	const outsInvalid = useMemo(() => outs == null || outs.length === 0, [outs])

	const { onSetPosition, pending } = useSetPosition()

	return (
		<Column width='100%' gap='18px' alignItems='center'>
			<RowCenter gap='18px'>
				<ManagePositionButton />
				<SummitButton
					disabled={!anyDirty || intervalDCAInvalid || outsInvalid || amountDCAInvalidReason != null}
					onClick={onSetPosition}
					isLoading={pending}
					activeText='Update Position'
					loadingText='Updating'
				/>
			</RowCenter>
			{anyDirty && (
				<Column width='100%' alignItems='center'>
					<Text bold color='warning' mb='8px' red={amountDCAInvalidReason != null || intervalDCAInvalid || outsInvalid}>
						Pending Changes:
					</Text>
					{tokenInDirty && (
						<Text italic small>
							Token In: <s>{getSymbol(tokenInCurrent)}</s> {'>'} <b>{getSymbol(tokenInPending)}</b>
						</Text>
					)}
					{amountDCADirty && (
						<Text italic small red={amountDCAInvalidReason != null}>
							DCA Amount: <s>{dcaAmountCurrent}</s> {'>'} <b>{dcaAmountPending}</b>
						</Text>
					)}
					{intervalDirty && (
						<Text italic small red={intervalDCAInvalid}>
							DCA Interval: every <s>{suffix(intervalCurrent)}</s> {'>'} <b>{suffix(intervalPending)}</b>
						</Text>
					)}
					{maxGasPriceDirty && (
						<Text italic small>
							Max Gas Price: <s>{maxGasPriceCurrent}</s> {'>'} <b>{maxGasPricePending}</b>
						</Text>
					)}
					{outsDirty && (
						<Text italic small red={outsInvalid}>
							DCA Portfolio Tokens or Weights Changed
						</Text>
					)}
				</Column>
			)}
		</Column>
	)
}

export const PositionCard: React.FC = () => {
	return (
		<Card title='Position' mobilePadding='12px' padding='24px'>
			<CellRow>
				<CellCol>
					<TokenInCell />
				</CellCol>
				<CellCol>
					<OptionsCell />
				</CellCol>
			</CellRow>
			<CellRow>
				<OutsCell />
			</CellRow>
			<CellRow>
				<ActionsCell />
			</CellRow>
		</Card>
	)
}
