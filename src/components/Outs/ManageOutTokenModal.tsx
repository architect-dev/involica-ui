import React, { useCallback } from 'react'
import { TokenButton } from '@components/TokenButton'
import { ModalContentContainer, RowCenter, SummitButton, SummitPopUp, Text } from '@uikit'
import { useConfigurableOuts } from '@state/hooks'
import { useShowHideModal } from '@utils'
import { MaxSlippageSelector } from './MaxSlippageSelector'
import TokenIconAndSymbol from '@components/TokenIconAndSymbol'
import styled from 'styled-components'
import { DataRow } from '@uikit/components/DataRow'
import { Minus } from 'react-feather'

const StyledMinus = styled(Minus)`
	color: #ffffff;
	stroke-weight: 2.5;
`

export const ManageOutTokenModal: React.FC<{
	token: string
	onDismiss?: () => void
}> = ({ token, onDismiss }) => {
	const { removeOut } = useConfigurableOuts()
	const handleRemove = useCallback(() => {
		removeOut(token)
		onDismiss()
	}, [removeOut, token, onDismiss])
	return (
		<ModalContentContainer minWidth='300px' alignItems='flex-start' gap='12px'>
			<Text small>Set Max Slippage:</Text>
			<MaxSlippageSelector token={token} />
			<br />
			<DataRow
				t='Remove Token from Position:'
				v={
					<SummitButton onClick={handleRemove} variant='danger' padding='0' width='28px'>
						<StyledMinus size='14px' />
					</SummitButton>
				}
			/>
			<br />
			<RowCenter>
				<SummitButton onClick={onDismiss} activeText='Close' variant='secondary' />
			</RowCenter>
		</ModalContentContainer>
	)
}

const FlexText = styled(Text)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-weight: bold;
`

export const ManageOutTokenButton: React.FC<{ token: string; changed?: boolean }> = ({ token, changed }) => {
	const [open, show, hide] = useShowHideModal()
	return (
		<SummitPopUp
			open={open}
			callOnDismiss={hide}
			modal
			button={<TokenButton token={token} noTokenString='Missing' changed={changed} onClick={show} />}
			popUpTitle={
				<FlexText>
					Manage
					<TokenIconAndSymbol token={token} />
				</FlexText>
			}
			popUpContent={<ManageOutTokenModal token={token} />}
		/>
	)
}
