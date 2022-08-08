import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { elevate } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'

const useElevate = () => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()
  const cartographer = useCartographer()

  const handleElevate = useCallback(
    async (symbol: string, token: string, sourceElevation: Elevation, targetElevation: Elevation, amount: string, decimals: number, callback?: () => void) => {
      try {
        setPending(true)
        await elevate(cartographer, token, sourceElevation, targetElevation, amount, decimals)
        toastSuccess(`${symbol} Elevate Confirmed`)
      } catch (error) {
        toastError(`${symbol} Elevate Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
        if (callback != null) callback()
      }
    },
    [account, dispatch, cartographer, setPending, toastSuccess, toastError],
  )

  return { onElevate: handleElevate, pending }
}

export default useElevate
