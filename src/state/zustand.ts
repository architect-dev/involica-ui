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
      const userData = await fetchUserData(account)
      if (userData == null) return
      set({ userData, userDataLoaded: true })
    },
    
    tokens: null,
    nativeToken: null,
    publicDataLoaded: false,
    fetchPublicData: async () => {
      const publicData = await fetchPublicData()
      if (publicData == null) return
      set({ ...publicData, publicDataLoaded: true })
    },
  })
  // ), {
  //   name: `involica_${CHAIN_ID}`
  // })
)
