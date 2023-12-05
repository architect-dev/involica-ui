import React from 'react'
import { SummitButton, Text } from '@uikit'
import { ModalContentContainer } from '@uikit/widgets/Popup/SummitPopUp'
import { PositionExpectedAndDurationOverview, PositionSwapsOverview } from './PositionOverviewElements'

export const ConfigPreviewModal: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
	return (
		<ModalContentContainer maxWidth='400px' gap='24px'>
			<Text px='48px' textAlign='center'>
				This preview will start empty, and will fill as you build your position!
			</Text>

			<Text small italic mr='auto'>
				DCA Overview:
			</Text>
			<PositionSwapsOverview />

			<Text small italic pr='48px' mr='auto'>
				Number of DCAs that are expected to execute based on the amount to DCA and DCA interval:
			</Text>
			<PositionExpectedAndDurationOverview />
			<SummitButton onClick={onDismiss} activeText='Close' variant='secondary' />
		</ModalContentContainer>
	)
}
