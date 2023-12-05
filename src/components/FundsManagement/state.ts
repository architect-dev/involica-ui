import { create } from 'zustand'

interface FundsManagementState {
	topUpModalOpen: boolean
	showTopUpModal: () => void
	hideTopUpModal: () => void

	withdrawModalOpen: boolean
	showWithdrawModal: () => void
	hideWithdrawModal: () => void
}

export const useFundsManagementState = create<FundsManagementState>()((set) => ({
	topUpModalOpen: false,
	showTopUpModal: () => set({ topUpModalOpen: true }),
	hideTopUpModal: () => set({ topUpModalOpen: false }),

	withdrawModalOpen: false,
	showWithdrawModal: () => set({ withdrawModalOpen: true }),
	hideWithdrawModal: () => set({ withdrawModalOpen: false }),
}))
