/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getFarmConfigs } from 'config/constants/farms'
import { fetchFarms } from './fetchFarms'
import {
  fetchElevationsRoundRewards,
  fetchElevClaimableRewards,
  fetchElevPotentialWinnings,
  fetchFarmUserData,
  fetchLifetimeWinningsAndBonuses,
} from './fetchFarmUser'
import { FarmsState } from '../types'
import BigNumber from 'bignumber.js'
import { BN_ZERO, elevationUtils } from 'config/constants/types'
import { merge } from 'lodash'

const EMPTY_ELEVATION_FARMS_DATA = {
  claimable: BN_ZERO,
  claimableBonus: BN_ZERO,
  yieldContributed: BN_ZERO,
  potentialWinnings: BN_ZERO,
  roundRewards: BN_ZERO,
  totemRoundRewards: [],
  totemMultipliers: [],
}

const initialState: FarmsState = {
  farmsLoaded: false,
  userDataLoaded: false,
  elevationDataLoaded: false,
  lifetimeSummitWinnings: BN_ZERO,
  lifetimeSummitBonuses: BN_ZERO,
  data: [...getFarmConfigs()],
  elevationData: [
    EMPTY_ELEVATION_FARMS_DATA,
    EMPTY_ELEVATION_FARMS_DATA,
    EMPTY_ELEVATION_FARMS_DATA,
    EMPTY_ELEVATION_FARMS_DATA,
  ],
}

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData = action.payload
      state.data = state.data.map((farm) => merge({}, farm, liveFarmsData[farm.symbol]))
      state.farmsLoaded = true
    },
    setFarmUserData: (state, action) => {
      const { farmsUserData } = action.payload
      state.data = state.data.map((farm) => ({
        ...farm,
        elevations: merge({}, farm.elevations, farmsUserData[farm.symbol])
      }))
      state.userDataLoaded = true
    },
    setElevationFarmsData: (state, action) => {
      const { elevClaimableBonuses, elevClaimableRewards, elevPotentialWinnings, elevRoundRewards, lifetimeWinningsAndBonuses } = action.payload
      state.elevationData = elevationUtils.all.map((elevation) => ({
        claimable: elevClaimableRewards[elevation] as BigNumber,
        claimableBonus: elevClaimableBonuses[elevation] as BigNumber,
        yieldContributed: elevPotentialWinnings[elevation].yieldContributed as BigNumber,
        potentialWinnings: elevPotentialWinnings[elevation].potentialWinnings as BigNumber,
        roundRewards: elevRoundRewards[elevation].roundRewards as BigNumber,
        totemRoundRewards: elevRoundRewards[elevation].totemRoundRewards as BigNumber[],
        totemMultipliers: elevRoundRewards[elevation].totemMultipliers as number[],
      }))
      state.elevationDataLoaded = true
      state.lifetimeSummitWinnings = lifetimeWinningsAndBonuses.lifetimeSummitWinnings
      state.lifetimeSummitBonuses = lifetimeWinningsAndBonuses.lifetimeSummitBonuses
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData, setElevationFarmsData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch) => {
  const farmsInfo = await fetchFarms()
  dispatch(setFarmsPublicData(farmsInfo))
}
export const fetchFarmUserDataAsync = (account) => async (dispatch) => {
  const farmConfigs = getFarmConfigs()

  const [
    {
      farmsUserData,
      elevClaimableBonuses,
    },
    elevClaimableRewards,
    elevPotentialWinnings,
    elevRoundRewards,
    lifetimeWinningsAndBonuses,
  ] = await Promise.all([
    await fetchFarmUserData(account, farmConfigs),
    await fetchElevClaimableRewards(account),
    await fetchElevPotentialWinnings(account),
    await fetchElevationsRoundRewards(farmConfigs),
    await fetchLifetimeWinningsAndBonuses(account),
  ])

  dispatch(setFarmUserData({ farmsUserData }))
  dispatch(setElevationFarmsData({ elevClaimableBonuses, elevClaimableRewards, elevPotentialWinnings, elevRoundRewards, lifetimeWinningsAndBonuses }))
}

export default farmsSlice.reducer
