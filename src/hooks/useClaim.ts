import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { claimPool, claimElevation, capitalizeFirstLetter } from 'utils'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'
import { fetchUserEpochsAsync } from 'state/glacier'


export const useClaimPool = (farmToken: string, elevation: Elevation) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const cartographer = useCartographer()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleClaim = useCallback(async () => {
    try {
      setPending(true)
      await claimPool(cartographer, farmToken, elevation)
      toastSuccess('Rewards Claimed Successfully')
    } catch (error) {
      toastError('Error Claiming Rewards', (error as Error).message)
    } finally {
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
      setPending(false)
    }
  }, [
    farmToken,
    elevation,
    account,
    dispatch,
    cartographer,
    setPending,
    toastSuccess,
    toastError,
  ])

  return { onClaim: handleClaim, pending }
}

export const useClaimElevation = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const cartographer = useCartographer()
  const [claimPending, setClaimPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleClaimElevation = useCallback(
    async (elevations: Elevation[]) => {
      const elevOrMultiElevText = elevations.length === 1 ?
        capitalizeFirstLetter(elevations[0]) :
        'All Elevations'
      const successToast = `${elevOrMultiElevText} Winnings Frozen`
      const errorToast = `Error Freezing ${elevOrMultiElevText} Winnings`
      try {

        setClaimPending(true)

        await Promise.all(
          elevations.map((elev) => claimElevation(cartographer, elev))
        )

        toastSuccess(successToast)

      } catch (error) {
        toastError(errorToast, (error as Error).message)
      } finally {
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
        dispatch(fetchUserEpochsAsync(account))
        setClaimPending(false)
      }
    },
    [account, dispatch, cartographer, setClaimPending, toastSuccess, toastError],
  )

  return { onClaimElevation: handleClaimElevation, claimPending }
}
