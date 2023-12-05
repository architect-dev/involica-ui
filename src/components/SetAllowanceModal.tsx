import React, { useCallback, useMemo, useState } from 'react'
import { useApprove } from '@hooks/useExecute'
import { MaxUint256 } from 'ethers/constants'
import { usePositionTokenInWithData, usePositionAmountDCA } from '@state/hooks'
import { SummitButton, Text, RowCenter, SummitPopUp } from '@uikit'
import { bn, bnDisplay, eN, useShowHideModal } from '@utils'
import NumericInput from './Input/NumericInput'
import TokenAndAmountSelector from './TokenAndAmountSelector'
import { ModalContentContainer } from '@uikit/widgets/Popup/SummitPopUp'
import { DataRow } from '../uikit/components/DataRow'
import { validateDcasCount } from '@state/utils'

export const SetAllowanceModal: React.FC<{
	onDismiss?: () => void
}> = ({ onDismiss }) => {
	const { tokenIn, dirty: tokenInDirty, tokenInData, tokenInUserData } = usePositionTokenInWithData(true)
	const { amountDCA, dirty: amountDCADirty } = usePositionAmountDCA(true)

	const amountDCAInvalid = useMemo(() => amountDCA == null || amountDCA === '' || amountDCA === '0', [amountDCA])

	const { onApprove, onInfApprove, pending } = useApprove(tokenInData?.symbol, tokenIn)
	const [rawDcasCount, setRawDcasCount] = useState<string>('')
	const [dcasCountInvalidReason, setDcasCountInvalidReason] = useState<string | null>(amountDCAInvalid ? 'Your current DCA amount is 0' : null)
	const [rawApprovalAmount, setRawApprovalAmount] = useState<string>('')
	const [approvalAmountInvalidReason, setApprovalAmountInvalidReason] = useState<string | null>(null)

	const allowance = useMemo(() => {
		if (bn(tokenInUserData?.allowance).gte(bn(MaxUint256.toString()).div(2))) return 'Inf'
		return bnDisplay(tokenInUserData?.allowance, tokenInData?.decimals)
	}, [tokenInData?.decimals, tokenInUserData?.allowance])

	// BY DCAS COUNT

	const handleSetDcasCount = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			const val = e.currentTarget.value
			setRawDcasCount(val)
			setDcasCountInvalidReason(validateDcasCount(val) ?? (amountDCAInvalid ? 'Your current DCA amount is 0' : null))

			setRawApprovalAmount('')
			setApprovalAmountInvalidReason(null)
		},
		[amountDCAInvalid]
	)

	const approvalAmountByDcasCount = useMemo(() => {
		if (rawDcasCount === '' || rawDcasCount == null || isNaN(parseInt(rawDcasCount)) || amountDCA == null || amountDCA === '') return '-'
		return bnDisplay(bn(eN(amountDCA, tokenInData?.decimals)).times(parseInt(rawDcasCount)), tokenInData?.decimals, 3)
	}, [amountDCA, rawDcasCount, tokenInData?.decimals])

	const handleApproveDcasCount = useCallback(() => {
		onApprove(bn(amountDCA).times(rawDcasCount).toString(), tokenInData?.decimals)
	}, [amountDCA, rawDcasCount, onApprove, tokenInData?.decimals])

	// BY RAW AMOUNT

	const handleSetApprovalAmount = useCallback(
		(val: string) => {
			setRawApprovalAmount(val)

			// Test validity
			let invalidReason = null
			if (val === '' || val == null) invalidReason = null
			else if (isNaN(parseFloat(val))) invalidReason = 'Not a number'
			else if (parseFloat(val) <= 0) invalidReason = 'Must be greater than 0'
			setApprovalAmountInvalidReason(invalidReason)

			setRawDcasCount('')
			setDcasCountInvalidReason(amountDCAInvalid ? 'Your current DCA amount is 0' : null)
		},
		[amountDCAInvalid]
	)

	const rawApprovalAmountDisplay = useMemo(() => {
		if (approvalAmountInvalidReason != null || rawApprovalAmount === '' || rawApprovalAmount == null || isNaN(parseInt(rawApprovalAmount))) return '-'
		return bn(rawApprovalAmount).toFixed(3)
	}, [approvalAmountInvalidReason, rawApprovalAmount])

	const rawApprovalAmountDcasCovered = useMemo(() => {
		if (
			approvalAmountInvalidReason != null ||
			rawApprovalAmount === '' ||
			rawApprovalAmount == null ||
			isNaN(parseInt(rawApprovalAmount)) ||
			amountDCA == null ||
			amountDCA === '' ||
			amountDCA === '0'
		)
			return '-'
		return Math.floor(bn(rawApprovalAmount).div(amountDCA).toNumber())
	}, [amountDCA, approvalAmountInvalidReason, rawApprovalAmount])

	const handleApproveRawAmount = useCallback(() => {
		onApprove(rawApprovalAmount, tokenInData?.decimals)
	}, [onApprove, rawApprovalAmount, tokenInData?.decimals])

	// INF

	const alreadyInfApproved = useMemo(() => allowance === 'Inf', [allowance])

	return (
		<ModalContentContainer alignItems='flex-start' minWidth='300px' maxWidth='400px' gap='12px'>
			{(tokenInDirty || amountDCADirty) && (
				<>
					<Text bold color='warning'>
						You have changed your {tokenInDirty ? 'DCA Token ' : ''}
						{tokenInDirty && amountDCADirty ? 'and ' : ''}
						{amountDCADirty ? 'DCA Amount ' : ''} above, we recommend you UPDATE your Position before Approving.
					</Text>
					<br />
				</>
			)}
			<DataRow t='Current DCA Amount:' v={`${amountDCA} ${tokenInData?.symbol}`} />

			<br />
			<Text small italic>
				Approve by number of DCAs to Execute:
			</Text>
			<NumericInput value={rawDcasCount} onChange={handleSetDcasCount} endText='dcas' placeholder='0' invalid={dcasCountInvalidReason != null} />
			{dcasCountInvalidReason != null && (
				<Text red italic small>
					{dcasCountInvalidReason}
				</Text>
			)}
			<SummitButton
				disabled={dcasCountInvalidReason != null || rawDcasCount === '' || rawDcasCount == null}
				isLoading={pending}
				onClick={handleApproveDcasCount}
				activeText={`Approve ${rawDcasCount == null || rawDcasCount === '' ? '-' : rawDcasCount} DCA${
					rawDcasCount !== '1' ? 's' : ''
				} (${approvalAmountByDcasCount} ${tokenInData?.symbol})`}
				loadingText='Approving'
				padding='0px 18px'
			/>

			<Text small italic margin='6px auto'>
				- or -
			</Text>

			<Text small italic>
				Approve Raw Amount:
			</Text>
			<TokenAndAmountSelector
				token={tokenIn}
				value={rawApprovalAmount}
				setValue={handleSetApprovalAmount}
				invalidReason={approvalAmountInvalidReason}
				tokenSelectDisabled
			/>
			<SummitButton
				disabled={approvalAmountInvalidReason != null || rawApprovalAmount === '' || rawApprovalAmount == null}
				isLoading={pending}
				onClick={handleApproveRawAmount}
				activeText={`Approve ${rawApprovalAmountDisplay} ${tokenInData?.symbol}${amountDCAInvalid ? '' : ` (${rawApprovalAmountDcasCovered} DCAs)`}`}
				loadingText='Approving'
				padding='0px 18px'
			/>

			<Text small italic margin='6px auto'>
				- or -
			</Text>

			<Text small italic>
				Infinite Approve:
				<br />
				(DCA will execute until wallet balance runs out)
			</Text>
			<SummitButton
				disabled={alreadyInfApproved}
				isLoading={pending}
				onClick={onInfApprove}
				activeText={alreadyInfApproved ? 'Approved' : 'Inf Approve'}
				loadingText='Approving'
				padding='0px 18px'
			/>

			<br />
			<br />
			<RowCenter>
				<SummitButton onClick={onDismiss} activeText='Close' variant='secondary' />
			</RowCenter>
		</ModalContentContainer>
	)
}

export const SetAllowanceButton: React.FC<{ buttonText?: string }> = ({ buttonText = 'Set Allowance' }) => {
	const [open, show, hide] = useShowHideModal()
	return (
		<SummitPopUp
			open={open}
			callOnDismiss={hide}
			modal
			button={<SummitButton onClick={show}>{buttonText}</SummitButton>}
			popUpTitle='Set Allowance'
			popUpContent={<SetAllowanceModal />}
		/>
	)
}
