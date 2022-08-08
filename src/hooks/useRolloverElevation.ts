import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  fetchElevationHelperInfoAsync,
  fetchExpeditionUserDataAsync,
  fetchFarmUserDataAsync,
  updateElevationInfoAsync,
} from 'state/actions'
import { rolloverElevation, rolloverExpedition } from 'utils/callHelpers'
import { useCartographer, useExpedition } from './useContract'
import { Elevation } from 'config/constants/types'
import useToast from './useToast'
import { fetchTokensUserDataAsync } from 'state/tokens'

const useRolloverElevation = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const cartographer = useCartographer()
  const expedition = useExpedition()
  const { toastError, toastSuccess } = useToast()
  const [elevsPending, setElevsPending] = useState({
    [Elevation.PLAINS]: false,
    [Elevation.MESA]: false,
    [Elevation.SUMMIT]: false,
    [Elevation.EXPEDITION]: false,
  })

  const handleRolloverElevation = useCallback(
    async (elevation: Elevation, isUnlock: boolean) => {
      setElevsPending((elevs) => ({ ...elevs, [elevation]: true }))
      try {
        if (elevation === Elevation.EXPEDITION) {
          await rolloverExpedition(expedition)
        } else {
          await rolloverElevation(cartographer, elevation)
        }
        toastSuccess(
          `THE ${elevation}: ${isUnlock ? 'Unlocked' : 'Rolled Over'}`,
          'You have been sent your SUMMIT reward',
        )
      } catch (error) {
        toastError(`THE ${elevation}: ${isUnlock ? 'Unlock' : 'Rollover'} Failed`, (error as Error).message)
      } finally {
        setElevsPending((elevs) => ({ ...elevs, [elevation]: false }))
        if (elevation === Elevation.EXPEDITION) {
          dispatch(fetchExpeditionUserDataAsync(account))
        } else {
          dispatch(fetchFarmUserDataAsync(account))
          dispatch(fetchTokensUserDataAsync(account))
        }
        dispatch(fetchElevationHelperInfoAsync())
        dispatch(updateElevationInfoAsync(elevation))
      }
    },
    [account, dispatch, cartographer, expedition, setElevsPending, toastSuccess, toastError],
  )

  return { onRolloverElevation: handleRolloverElevation, elevsPending }
}

export default useRolloverElevation
