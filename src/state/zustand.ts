import create from 'zustand'
import fetchPublicData from './fetchPublicData'
import fetchUserData from './fetchUserData'
import { State } from './types'

export const useInvolicaStore = create<State>((set) => ({
  account: null,
  isDark: false,
  setActiveAccount: (account: string) => set({ account }),
  clearActiveAccount: () => set({ account: null }),
  setIsDark: (isDark) => set({ isDark }),

  userData: null,
  tokens: null,
  userDataLoaded: false,
  publicDataLoaded: false,
  fetchUserData: async (account) => {
    set({ userData: await fetchUserData(account), userDataLoaded: true })
  },
  fetchPublicData: async () => {
    set({ tokens: await fetchPublicData(), publicDataLoaded: true })
  },
}))
