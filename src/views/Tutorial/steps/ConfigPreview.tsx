import React, { useCallback, useState } from 'react'
import { useIntroActiveStep } from '@state/configHooks'
import { IntroStep } from '@state/types'
import styled from 'styled-components'
import { SummitButton, SummitPopUp } from '@uikit'
import { ConfigPreviewModal } from './ConfigPreviewModal'

const FixedDiv = styled.div`
	position: sticky;
	top: 45px;
	margin-left: auto;
	width: 130px;
	z-index: 10;
`

export const ConfigPreview: React.FC = () => {
	const activeStep = useIntroActiveStep()
	const [open, setOpen] = useState(false)
	const show = useCallback(() => setOpen(false), [setOpen])
	const hide = useCallback(() => setOpen(false), [setOpen])
	if (activeStep <= IntroStep.TokenIn) return null
	return (
		<FixedDiv>
			<SummitPopUp
				open={open}
				callOnDismiss={hide}
				modal
				button={<SummitButton onClick={show} activeText='Preview Position' width='130px' />}
				popUpTitle='Preview Position:'
				popUpContent={<ConfigPreviewModal />}
			/>
		</FixedDiv>
	)
}
