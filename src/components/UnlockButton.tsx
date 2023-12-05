import React, { useCallback } from 'react'
import SummitButton from '@uikit/components/Button/SummitButton'
import { useInvolicaStore } from '@state/store'

const UnlockButton = (props) => {
	const setConnectModalOpen = useInvolicaStore((state) => state.setConnectModalOpen)
	const onPresentConnectModal = useCallback(() => setConnectModalOpen(true), [setConnectModalOpen])

	return (
		<SummitButton onClick={onPresentConnectModal} {...props}>
			CONNECT WALLET
		</SummitButton>
	)
}

export default React.memo(UnlockButton)
