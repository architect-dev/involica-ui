import React, { useMemo } from 'react'
import { useDcaTxPriceRange, usePositionMaxGasPrice } from '@state/hooks'
import { SummitButton, Text, RowCenter, SummitPopUp, TextButton, Column } from '@uikit'
import { bnDisplay, useShowHideModal } from '@utils'
import { ModalContentContainer } from '@uikit/widgets/Popup/SummitPopUp'
import { Edit3 } from 'react-feather'
import MaxGasPriceSelector from '@views/Tutorial/steps/MaxGasPriceSelector'
import { MaxGasPriceOptions } from '@state/types'
import { DataRow } from '../uikit/components/DataRow'
import { getNativeTokenSymbol } from '@config/constants'

export const EditMaxGasPriceModal: React.FC<{
	onDismiss?: () => void
}> = ({ onDismiss }) => {
	const minGasPrice: MaxGasPriceOptions = '100'
	const { minTxPrice, maxTxPrice, maxGasPrice } = useDcaTxPriceRange()
	const { maxGasPrice: currentMaxGasPrice } = usePositionMaxGasPrice(true)
	const dirty = useMemo(() => currentMaxGasPrice !== maxGasPrice, [currentMaxGasPrice, maxGasPrice])
	const maxTxPriceDisplay = useMemo(() => {
		if (maxTxPrice == null || maxTxPrice === '' || maxTxPrice === '0') return '-'
		return bnDisplay(maxTxPrice, 18, 4)
	}, [maxTxPrice])
	const minTxPriceDisplay = useMemo(() => {
		if (minTxPrice == null || minTxPrice === '' || minTxPrice === '0') return '-'
		return bnDisplay(minTxPrice, 18, 4)
	}, [minTxPrice])

	return (
		<ModalContentContainer alignItems='flex-start' minWidth='300px' maxWidth='350px' gap='12px'>
			<Column alignItems='flex-start' gap='18px' width='100%'>
				<Column alignItems='flex-start' width='100%'>
					<DataRow t='Min Gas Price (Hard Coded):' v={`${minGasPrice} gwei`} />
					<DataRow t='Min DCA Tx Gas:' v={`${minTxPriceDisplay ?? '-'} ${getNativeTokenSymbol()}`} />
				</Column>

				<Text small italic>
					OPTIONAL: Select max DCA gas price:
					<br />
					(DCA execution will wait until gas price {'<='} max)
				</Text>

				<RowCenter>
					<MaxGasPriceSelector />
				</RowCenter>

				<Column alignItems='flex-start' width='100%'>
					<DataRow t='Max Gas Price:' v={`${maxGasPrice} gwei`} />
					<DataRow t='Max DCA Tx Gas:' v={`${maxTxPriceDisplay ?? '-'} ${getNativeTokenSymbol()}`} />
				</Column>

				{dirty && (
					<>
						<RowCenter gap='6px'>
							<Text color='warning'>
								Max Gas Changed: <s>{currentMaxGasPrice}</s> {'>'}
							</Text>
							<Text color='text' bold>
								{maxGasPrice}
							</Text>
						</RowCenter>
						<RowCenter>
							<Text small italic textAlign='center'>
								(Update your position for
								<br />
								this change to take effect)
							</Text>
						</RowCenter>
					</>
				)}
			</Column>

			<br />

			<RowCenter>
				<SummitButton onClick={onDismiss} activeText='Close' variant='secondary' />
			</RowCenter>
		</ModalContentContainer>
	)
}

export const EditMaxGasPriceButton: React.FC = () => {
	const [open, show, hide] = useShowHideModal()
	const { dirty, maxGasPrice } = usePositionMaxGasPrice()
	return (
		<SummitPopUp
			open={open}
			callOnDismiss={hide}
			modal
			button={
				<TextButton onClick={show} changed={dirty} asterisk asteriskPosition='-6px 0px'>
					{maxGasPrice} gwei
					<Edit3 size='14px' />
				</TextButton>
			}
			popUpTitle='Edit Max Gas Price'
			popUpContent={<EditMaxGasPriceModal />}
		/>
	)
}
