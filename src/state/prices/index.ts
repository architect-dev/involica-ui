/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { PriceState } from 'state/types'
import { LocalStorageKey, mapValues, readFromLocalStorage } from 'utils'
import { fetchPrices } from './fetchPrices'

const getLocalStoragePrices = () => {
  const localStoragePrices = readFromLocalStorage({
    key: LocalStorageKey.PRICES_PER_TOKEN,
    withChain: true,
    readDefault: {}
  })
  if (localStoragePrices == null) return { pricesPerToken: {} }
  const pricesPerToken = mapValues<string, BigNumber, boolean>(
    localStoragePrices,
    (price) => new BigNumber(price),
  ) as unknown as { [key: string]: BigNumber }
  return { pricesPerToken }
}

const initialState: PriceState = {
  ...getLocalStoragePrices()
}

export const PricesSlice = createSlice({
  name: 'Prices',
  initialState,
  reducers: {
    setPricesPerToken: (state, action) => {
      state.pricesPerToken = action.payload
    },
  },
})

// Actions
export const { setPricesPerToken } = PricesSlice.actions

// Thunks
export const fetchPricesAsync = () => async (dispatch) => {
  const pricesPerToken = await fetchPrices()
  if (pricesPerToken == null) return
  readFromLocalStorage({
    key: LocalStorageKey.PRICES_PER_TOKEN,
    withChain: true,
    value: JSON.stringify(pricesPerToken)
  })
  dispatch(setPricesPerToken(pricesPerToken))
}

export default PricesSlice.reducer
