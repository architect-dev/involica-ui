import React, { useCallback, useMemo, useState } from 'react'
import { useNativeTokenFullData, useUserTreasury } from '@state/hooks'
import { Nullable, bn, bnDisplay } from '@utils'
import TokenAndAmountSelector from '../TokenAndAmountSelector'
import { ModalContentContainer, SummitPopUp } from '@uikit/widgets/Popup/SummitPopUp'
import { getNativeTokenSymbol } from '@config/constants'
import { useWithdrawTreasury } from '@hooks/useExecute'
import { DataRow } from '@uikit/components/DataRow'
import { Text } from '@uikit/components/Text'
import { validateFundingWithdrawal } from '@state/utils'
import { useFundsManagementState } from './state'
import SummitButton from '@uikit/components/Button/SummitButton'
import { RowCenter } from '@uikit/components/Box'

export const WithdrawFundsButton: React.FC<{ buttonText?: string; onDismissParent?: () => void }> = ({
	buttonText = 'Withdraw Funds',
	onDismissParent = () => null,
}) => {
	const showWithdrawModal = useFundsManagementState((state) => state.showWithdrawModal)
	const showHandler = useCallback(() => {
		showWithdrawModal()
		onDismissParent()
	}, [onDismissParent, showWithdrawModal])
	return (
		<SummitButton width='120px' padding='0' onClick={showHandler}>
			{buttonText}
		</SummitButton>
	)
}

export const WithdrawFundsModalContent: React.FC<{
	onDismiss?: () => void
}> = ({ onDismiss }) => {
	const userTreasury = useUserTreasury()
	const { nativeTokenData } = useNativeTokenFullData()
	const userTreasuryDisplay = useMemo(() => (userTreasury == null ? '-' : bnDisplay(userTreasury, 18, 4)), [userTreasury])
	const userTreasuryUsdDisplay = useMemo(() => {
		if (userTreasury == null || nativeTokenData?.price == null) return '-'
		return `$${bnDisplay(bn(userTreasury).times(nativeTokenData.price), 18, 2)}`
	}, [nativeTokenData?.price, userTreasury])
	const { onWithdrawTreasury, pending } = useWithdrawTreasury()

	const [withdrawAmount, setWithdrawAmount] = useState<string>('')
	const [withdrawInvalidReason, setWithdrawInvalidReason] = useState<Nullable<string>>(null)

	const handleSetFundingAmount = useCallback(
		(val: string, max: string) => {
			setWithdrawAmount(val)
			setWithdrawInvalidReason(validateFundingWithdrawal(val, max, nativeTokenData))
		},
		[nativeTokenData]
	)

	const handleWithdrawTreasury = useCallback(() => {
		if (nativeTokenData?.decimals == null) return
		onWithdrawTreasury(withdrawAmount, nativeTokenData?.decimals)
	}, [withdrawAmount, nativeTokenData?.decimals, onWithdrawTreasury])

	return (
		<ModalContentContainer alignItems='flex-start' minWidth='300px' maxWidth='400px' gap='12px'>
			<DataRow
				t='Current Funding:'
				v={
					<Text textAlign='right'>
						<b>
							{userTreasuryDisplay} {getNativeTokenSymbol()}
						</b>
						<br />
						<i>{userTreasuryUsdDisplay}</i>
					</Text>
				}
			/>

			<br />
			<Text small italic>
				Withdraw Funds:
			</Text>
			<TokenAndAmountSelector
				token={nativeTokenData?.address}
				value={withdrawAmount}
				setValue={handleSetFundingAmount}
				invalidReason={withdrawInvalidReason}
				max={userTreasuryDisplay}
				balanceText='Current Funding'
				tokenSelectDisabled
			/>

			<br />
			<RowCenter gap='18px'>
				<SummitButton onClick={onDismiss} activeText='Close' variant='secondary' />
				<SummitButton
					isLoading={pending}
					onClick={handleWithdrawTreasury}
					activeText='Withdraw Funds'
					loadingText='Withdrawing'
					disabled={withdrawInvalidReason != null || withdrawAmount === ''}
					padding='0px 24px'
				/>
			</RowCenter>
		</ModalContentContainer>
	)
}

export const WithdrawFundsModal: React.FC = () => {
	const { withdrawModalOpen, hideWithdrawModal } = useFundsManagementState()
	return (
		<SummitPopUp open={withdrawModalOpen} callOnDismiss={hideWithdrawModal} modal popUpTitle='Withdraw Funds' popUpContent={<WithdrawFundsModalContent />} />
	)
}
