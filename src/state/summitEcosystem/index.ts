/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { BN_ZERO, Elevation, elevationUtils } from 'config/constants/types'
import { getLocalStorageAccount, LocalStorageKey, readFromLocalStorage, writeToLocalStorage } from 'utils'
import { FarmType, SummitEcosystemState } from '../types'
import { fetchElevationsData, fetchDeityDivider } from './fetchElevationInfo'
import { fetchUsersTotems } from './fetchUsersTotems'

const getLocalStorageVariables = () => {
  const activeAccount = getLocalStorageAccount()
  return {
    activeAccount,
    summitEnabled: readFromLocalStorage({
      key: LocalStorageKey.SUMMIT_ENABLED,
      withChain: true,
      readDefault: false
    }),
    totems: elevationUtils.all.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        readFromLocalStorage({
          key: LocalStorageKey.TOTEM,
          elevation,
          withChain: true,
          withAccount: true,
          readDefault: null
        })
    ),
    winningTotems: elevationUtils.allWithExpedition.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        readFromLocalStorage({
          key: LocalStorageKey.WINNING_TOTEM,
          elevation,
          withChain: true,
          readDefault: null
        })
    ),
    winningNumbersDrawn: elevationUtils.allWithExpedition.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        readFromLocalStorage({
          key: LocalStorageKey.WINNING_NUMBER_DRAWN,
          elevation,
          withChain: true,
          readDefault: null
        })
    ),
    elevMarkedWinningRound: elevationUtils.allWithExpedition.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        readFromLocalStorage({
          key: LocalStorageKey.MARKED_WINNING_ROUND,
          elevation,
          withChain: true,
          readDefault: 0
        })    
    ),
    totemSelectionRounds: elevationUtils.all.map((elevation): number =>
      elevation === Elevation.OASIS ?
        0 :
        readFromLocalStorage({
          key: LocalStorageKey.TOTEM_SELECTION_ROUND,
          elevation,
          withChain: true,
          readDefault: null
        }) 
    ),
    farmType: readFromLocalStorage({
      key: LocalStorageKey.FARM_TYPE,
      readDefault: FarmType.All
    }) as FarmType,
    elevationsInfo: elevationUtils.elevationExpedition.map((elevation) => {
      return readFromLocalStorage({
        key: LocalStorageKey.ELEVATION_INFO,
        elevation,
        withChain: true,
        readDefault: null
      })
    }),
    expeditionAPR: parseFloat(readFromLocalStorage({
      key: LocalStorageKey.EXPEDITION_APR,
      withChain: true,
      readDefault: 0,
    })),
  }
}

const initialState: SummitEcosystemState = {
  ...getLocalStorageVariables(),
  expeditionDivider: 50,
  liveFarms: true,
  pendingTxs: [],
  elevationRolloversToShow: [],
  rolloverRewardInNativeToken: BN_ZERO,
  expeditionPotTotalValue: 0,
  expeditionTreasurySummitBalance: BN_ZERO,
  pendingExpeditionTx: false,
  pendingTotemSelection: false,
  forceOpenConnectModal: false,
}

export const SummitEcosystemSlice = createSlice({
  name: 'SummitEcosystem',
  initialState,
  reducers: {
    setActiveAccount: (state, action) => {
      state.activeAccount = action.payload
      writeToLocalStorage({
        key: LocalStorageKey.ACTIVE_ACCOUNT,
        value: JSON.stringify(action.payload),
      })
    },
    clearActiveAccount: (state) => {
      state.activeAccount = null
      writeToLocalStorage({
        key: LocalStorageKey.ACTIVE_ACCOUNT,
        value: JSON.stringify(undefined),
      })
    },
    setSummitEnabled: (state, action) => {
      state.summitEnabled = action.payload
      writeToLocalStorage({
        key: LocalStorageKey.SUMMIT_ENABLED,
        withChain: true,
        value: JSON.stringify(action.payload),
      })
    },
    setDeityDivider: (state, action) => {
      const expeditionDivider = action.payload
      state.expeditionDivider = expeditionDivider
    },
    setElevationsData: (state, action) => {
      const elevationsData = action.payload
      state.elevationsInfo = elevationUtils.elevationExpedition.map((elevation) => {
        const elevInt = elevationUtils.toInt(elevation)
        const {roundNumber} = elevationsData[elevation]

        writeToLocalStorage({
          key: LocalStorageKey.WINNING_TOTEM,
          elevation,
          value: `${elevationsData[elevation].winningTotem}`,
          withChain: true
        })
        state.winningTotems[elevInt] = elevationsData[elevation].winningTotem
        writeToLocalStorage({
          key: LocalStorageKey.WINNING_NUMBER_DRAWN,
          elevation,
          value: `${elevationsData[elevation].winningNumberDrawn}`,
          withChain: true
        })
        state.winningNumbersDrawn[elevInt] = elevationsData[elevation].winningNumberDrawn
        writeToLocalStorage({
          key: LocalStorageKey.ELEVATION_INFO,
          elevation,
          value: JSON.stringify(elevationsData[elevation], null, 2),
          withChain: true
        })

        if (
          (state.totems[elevInt] != null) &&
          (state.totems[elevInt] === elevationsData[elevation].winningTotem) &&
          (roundNumber > state.elevMarkedWinningRound[elevInt])
        ) {
          state.elevationRolloversToShow.push(elevation)
        }

        state.elevMarkedWinningRound[elevInt] = roundNumber
        writeToLocalStorage({
          key: LocalStorageKey.MARKED_WINNING_ROUND,
          elevation,
          value: JSON.stringify(roundNumber, null, 2),
          withChain: true
        })

        return elevationsData[elevation]
      })
    },
    setTotemsData: (state, action) => {
      const totemsData = action.payload
      elevationUtils.allWithExpedition.forEach((elevation) => {
        state.totems[elevationUtils.toInt(elevation)] = totemsData[elevation].totem
        state.totemSelectionRounds[elevationUtils.toInt(elevation)] = totemsData[elevation].totemSelectionRound
        writeToLocalStorage({
          key: LocalStorageKey.TOTEM,
          elevation,
          value: `${totemsData[elevation].totem}`,
          withChain: true,
          withAccount: true
        })
        writeToLocalStorage({
          key: LocalStorageKey.TOTEM_SELECTION_ROUND,
          elevation,
          value: `${totemsData[elevation].totemSelectionRound}`,
          withChain: true,
          withAccount: true
        })
      })
    },
    updateElevationInfo: (state, action) => {
      const { elevation, elevationInfo } = action.payload
      state.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)] = elevationInfo
      state.winningTotems[elevationUtils.toInt(elevation)] = elevationInfo.winningTotem
      writeToLocalStorage({
        key: LocalStorageKey.WINNING_TOTEM,
        elevation,
        value: `${elevationInfo.winningTotem}`,
        withChain: true,
      })
    },
    updateElevationTotem: (state, action) => {
      const { elevation, totem } = action.payload
      state.totems[elevationUtils.toInt(elevation)] = totem
      writeToLocalStorage({
        key: LocalStorageKey.TOTEM,
        elevation,
        value: `${totem}`,
        withChain: true,
        withAccount: true,
      })
    },
    setFarmType: (state, action) => {
      const farmType = action.payload
      state.farmType = farmType
      writeToLocalStorage({
        key: LocalStorageKey.FARM_TYPE,
        value: farmType,
        withChain: true,
      })
    },
    setLiveFarms: (state, action) => {
      const live = action.payload
      state.liveFarms = live
    },
    addPendingTransaction: (state, action) => {
      const pendingTx = action.payload
      state.pendingTxs = [...state.pendingTxs, pendingTx]
    },
    removePendingTransaction: (state, action) => {
      const hash = action.payload
      state.pendingTxs = state.pendingTxs.filter((tx) => tx.hash !== hash)
    },
    clearElevationRolloversToShow: (state) => {
      state.elevationRolloversToShow = []
    },
    setRolloverRewardInNativeToken: (state, action) => {
      state.rolloverRewardInNativeToken = action.payload
    },
    setExpeditionPot: (state, action) => {
      state.expeditionTreasurySummitBalance = action.payload.treasurySummitBalance
      state.expeditionPotTotalValue = action.payload.potTotalValue
    },
    setPendingExpeditionTx: (state, action) => {
      state.pendingExpeditionTx = action.payload
    },
    setPendingTotemSelection: (state, action) => {
      state.pendingTotemSelection = action.payload
    },
    setExpeditionApr: (state, action) => {
      state.expeditionAPR = action.payload
      writeToLocalStorage({
        key: LocalStorageKey.EXPEDITION_APR,
        value: JSON.stringify(action.payload),
        withChain: true,
      })
    },
    setForceOpenConnectModal: (state, action) => {
      state.forceOpenConnectModal = action.payload
    },
  },
})

// Actions
export const {
  setActiveAccount,
  clearActiveAccount,
  setSummitEnabled,
  setDeityDivider,
  setElevationsData,
  setTotemsData,
  updateElevationInfo,
  updateElevationTotem,
  setFarmType,
  setLiveFarms,
  addPendingTransaction,
  removePendingTransaction,
  clearElevationRolloversToShow,
  setRolloverRewardInNativeToken,
  setExpeditionPot,
  setPendingExpeditionTx,
  setPendingTotemSelection,
  setExpeditionApr,
  setForceOpenConnectModal,
} = SummitEcosystemSlice.actions

// Thunks
export const fetchElevationsPublicDataAsync = () => async (dispatch) => {
  const elevationsInfo = await fetchElevationsData()
  if (elevationsInfo == null) return
  dispatch(setElevationsData(elevationsInfo))
}
export const fetchUserTotemsAsync = (account) => async (dispatch) => {
  const totems = await fetchUsersTotems(account)
  if (totems == null) return
  dispatch(setTotemsData(totems))
}
export const fetchElevationHelperInfoAsync = () => async (dispatch) => {
  const deityDivider = await fetchDeityDivider()
  if (deityDivider == null) return
  dispatch(setDeityDivider(deityDivider))
}
export const updateElevationInfoAsync = (elevation: Elevation) => async (dispatch) => {
  const elevationsInfo = await fetchElevationsData(elevation)
  if (elevationsInfo == null) return
  dispatch(updateElevationInfo({ elevation, elevationInfo: { ...elevationsInfo[elevation] } }))
}
export const updateFarmType = (farmType: FarmType) => async (dispatch) => {
  dispatch(setFarmType(farmType))
}
export const updateLiveFarms = (live: boolean) => async (dispatch) => {
  dispatch(setLiveFarms(live))
}
export const addPendingTx = (hash: string, title: string) => async (dispatch) => {
  dispatch(addPendingTransaction({ hash, title }))
}
export const removePendingTx = (hash: string) => async (dispatch) => {
  dispatch(removePendingTransaction(hash))
}
export const updatePendingTotemSelection = (pending) => async (dispatch) => {
  dispatch(setPendingTotemSelection(pending))
}

export default SummitEcosystemSlice.reducer
