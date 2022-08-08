/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getFarmTokens } from 'config/constants'
import { sum } from 'lodash'
import { TokensState } from 'state/types'
import { LocalStorageKey, readFromLocalStorage, writeToLocalStorage } from 'utils'
import { fetchTokensUserData } from './fetchTokensData'

const getAvgStakingLoyaltyDuration = () => {
  const localStorageAvg = readFromLocalStorage({
    key: LocalStorageKey.AVG_STAKING_LOYALTY_DURATION,
    withChain: true,
    readDefault: 0
  })
  if (isNaN(parseFloat(localStorageAvg))) return 0
  return localStorageAvg
}
const getSymbolAprs = () => {
  return readFromLocalStorage({
    key: LocalStorageKey.FARM_APRS,
    withChain: true,
    readDefault: {}
  })
}

const initialState: TokensState = {
  data: getFarmTokens(),
  avgStakingLoyaltyDuration: getAvgStakingLoyaltyDuration(),
  aprs: getSymbolAprs(),
}

export const TokensSlice = createSlice({
  name: 'Tokens',
  initialState,
  reducers: {
    setTokensUserData: (state, action) => {
      const { tokensUserData, avgStakingLoyaltyDuration } = action.payload
      state.data = state.data.map((token) => ({
        ...token,
        ...tokensUserData[token.symbol]
      }))
      state.avgStakingLoyaltyDuration = avgStakingLoyaltyDuration
      writeToLocalStorage({
        key: LocalStorageKey.AVG_STAKING_LOYALTY_DURATION,
        withChain: true,
        value: avgStakingLoyaltyDuration
      })
    },
    setSymbolAPRs: (state, action) => {
      const symbolAprs = action.payload
      state.aprs = symbolAprs
      writeToLocalStorage({
        key: LocalStorageKey.FARM_APRS,
        withChain: true,
        value: JSON.stringify(symbolAprs)
      })
    }
  },
})

// Actions
export const { setTokensUserData, setSymbolAPRs } = TokensSlice.actions

// Thunks
export const fetchTokensUserDataAsync = (account) => async (dispatch) => {
  const tokensUserData = await fetchTokensUserData(account)

  const currentTimestamp = Math.floor(Date.now() / 1000)
  
  const bonusResetTimestamps = Object.values(tokensUserData)
    .filter((tokenData) => tokenData.bonusResetTimestamp !== 0)
    .map((tokenData) => (currentTimestamp - tokenData.bonusResetTimestamp))

  const avgStakingLoyaltyDuration = bonusResetTimestamps.length === 0 ?
    0 :
    sum(bonusResetTimestamps) / bonusResetTimestamps.length
  dispatch(setTokensUserData({tokensUserData, avgStakingLoyaltyDuration}))
}

export default TokensSlice.reducer
