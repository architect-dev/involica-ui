/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { fetchExpeditionInfo } from './fetchExpeditionInfo'
import {
  fetchExpeditionWinnings,
  fetchExpeditionUserData,
} from './fetchExpeditionUserInfo'
import { ExpeditionState } from '../types'
import BigNumber from 'bignumber.js'
import { getLocalStorageAccount, LocalStorageKey, readFromLocalStorage, writeToLocalStorage } from 'utils'

const getUserLocalStorageVariables = () => {
  return {
    deity: readFromLocalStorage({
      key: LocalStorageKey.EXPEDITION_DEITY,
      withChain: true,
      withAccount: true,
      readDefault: null
    }),
    faith: readFromLocalStorage({
      key: LocalStorageKey.EXPEDITION_FAITH,
      withChain: true,
      withAccount: true,
      readDefault: null
    }),
    entered: readFromLocalStorage({
      key: LocalStorageKey.EXPEDITION_ENTERED,
      withChain: true,
      withAccount: true,
      readDefault: null
    }),
  }
}


const BN_ZERO = new BigNumber(0)
const emptyUserData = {
  everestOwned: BN_ZERO,

  deitySelectionRound: 0,
  ...getUserLocalStorageVariables(),

  summitLifetimeWinnings: BN_ZERO,
  usdcLifetimeWinnings: BN_ZERO,

  summitWinnings: BN_ZERO,
  usdcWinnings: BN_ZERO,
}

const emptyExpeditionTokenInfo = {
  roundEmission: BN_ZERO,
  emissionsRemaining: BN_ZERO,
  markedForDist: BN_ZERO,
  distributed: BN_ZERO,
}

const emptyExpedition = {
  live: false,
  launched: false,

  safeEverest: BN_ZERO,
  deitiedEverest: BN_ZERO,
  deityEverest: [BN_ZERO, BN_ZERO],

  summit: emptyExpeditionTokenInfo,
  usdc: emptyExpeditionTokenInfo,

  roundsRemaining: 0,
}

const initialState: ExpeditionState = {
  userData: emptyUserData,
  userDataLoaded: false,
  data: emptyExpedition,
  expeditionLoaded: false,
}

export const ExpeditionSlice = createSlice({
  name: 'Expedition',
  initialState,
  reducers: {
    setExpeditionPublicData: (state, action) => {
      state.data = action.payload
      state.expeditionLoaded = true
    },
    setExpeditionUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      }
      state.userDataLoaded = true
      const activeAccount = getLocalStorageAccount()
      if (activeAccount != null) {
        writeToLocalStorage({
          key: LocalStorageKey.EXPEDITION_DEITY,
          withChain: true,
          withAccount: true,
          value: action.payload.deity
        })
        writeToLocalStorage({
          key: LocalStorageKey.EXPEDITION_FAITH,
          withChain: true,
          withAccount: true,
          value: action.payload.faith
        })
        writeToLocalStorage({
          key: LocalStorageKey.EXPEDITION_ENTERED,
          withChain: true,
          withAccount: true,
          value: action.payload.entered
        })
      }
    },
    updateExpeditionUserWinnings: (state, action) => {
      const { summitWinnings, usdcWinnings } = action.payload
      state.userData.summitWinnings = summitWinnings
      state.userData.usdcWinnings = usdcWinnings
    },
  },
})

// Actions
export const {
  setExpeditionPublicData,
  setExpeditionUserData,
  updateExpeditionUserWinnings,
} = ExpeditionSlice.actions

// Thunks
export const fetchExpeditionPublicDataAsync = () => async (dispatch) => {
  const expeditionInfo = await fetchExpeditionInfo()
  if (expeditionInfo == null) return
  dispatch(setExpeditionPublicData(expeditionInfo))
}

export const fetchExpeditionUserDataAsync = (account) => async (dispatch) => {
  const userData = await fetchExpeditionUserData(account)
  if (userData == null) return
  dispatch(setExpeditionUserData(userData))
}

export const updateExpeditionUserWinningsAsync = (account: string) => async (dispatch) => {
  const winnings = await fetchExpeditionWinnings(account)
  if (winnings == null) return
  dispatch(updateExpeditionUserWinnings(winnings))
}

export default ExpeditionSlice.reducer
