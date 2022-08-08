import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { stake } from 'utils/callHelpers'
import { useCartographer } from './useContract'
import { useTransactionToasts } from './useToast'
import { Elevation } from 'config/constants/types'
import { fetchTokensUserDataAsync } from 'state/tokens'

const useStake = () => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account } = useWeb3React()
  const cartographer = useCartographer()

  const handleStake = useCallback(
    async (symbol: string, farmToken: string, elevation: Elevation, amount: string, decimals: number, callback?: () => void) => {
      const filteredAmount = amount || '0'
      try {
        setPending(true)
        await stake(cartographer, farmToken, elevation, filteredAmount, account, decimals)
        toastSuccess(`${symbol} Deposit Confirmed`)
      } catch (error) {
        toastError(`${symbol} Deposit Failed`, (error as Error).message)
      } finally {
        setPending(false)
        dispatch(fetchFarmUserDataAsync(account))
        dispatch(fetchTokensUserDataAsync(account))
        if (callback != null) callback()
      }
    },
    [account, dispatch, cartographer, setPending, toastSuccess, toastError],
  )

  return { onStake: handleStake, pending }
}

export default useStake
