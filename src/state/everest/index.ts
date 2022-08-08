/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { BN_ZERO } from 'config/constants'
import { EverestState } from 'state/types'
import { fetchEverestData } from './fetchEverestData'

const initialState: EverestState = {
  totalSummitLocked: BN_ZERO,
  averageLockDuration: 0,
  everestSupply: BN_ZERO,
}

export const EverestSlice = createSlice({
  name: 'Glacier',
  initialState,
  reducers: {
    setEverestData: (state, action) => {
      state.totalSummitLocked = action.payload.totalSummitLocked
      state.averageLockDuration = action.payload.averageLockDuration
      state.everestSupply = action.payload.everestSupply
      state.userData = action.payload.userData
    }
  },
})

// Actions
export const { setEverestData } = EverestSlice.actions

// Thunks
export const fetchEverestDataAsync = (account) => async (dispatch) => {
  const everestData = await fetchEverestData(account)
  dispatch(setEverestData(everestData))
}

export default EverestSlice.reducer
