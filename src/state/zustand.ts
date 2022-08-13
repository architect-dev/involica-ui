import { CHAIN_ID } from 'utils'
import create from 'zustand'
import fetchPublicData from './fetchPublicData'
import fetchUserData from './fetchUserData'
import { State } from './types'

export const useInvolicaStore = create<State>()(
  (set) => ({
    account: null,
    isDark: false,
    connectModalOpen: false,
    setActiveAccount: (account: string) => set({ account }),
    clearActiveAccount: () => set({ account: null }),
    setIsDark: (isDark) => set({ isDark }),
    setConnectModalOpen: (connectModalOpen) => set({ connectModalOpen }),

    userData: null,
    userDataLoaded: false,
    fetchUserData: async (account) => {
      set({ userData: await fetchUserData(account), userDataLoaded: true })
    },
    
    tokens: null,
    nativeToken: null,
    publicDataLoaded: false,
    fetchPublicData: async () => {
      set({ ...(await fetchPublicData()), publicDataLoaded: true })
    },
  })
  // ), {
  //   name: `involica_${CHAIN_ID}`
  // })
)
