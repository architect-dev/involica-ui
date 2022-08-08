import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { useEverestToken } from './useContract'
import { useTransactionToasts } from './useToast'
import { fetchEverestDataAsync } from 'state/everest'
import { panicWithdrawalLockedSummit, withdrawLockedSummit } from 'utils'

export const useUnlockSummit = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const everestToken = useEverestToken()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleUnlockSummit = useCallback(
    async (amount: string) => {
      const filteredAmount = amount || '0'
      try {
        setPending(true)
        await withdrawLockedSummit(everestToken, filteredAmount)
        toastSuccess(`SUMMIT Unlocked`)
      } catch (error) {
        toastError(`Error unlocking SUMMIT`, (error as Error).message)
      } finally {
        dispatch(fetchEverestDataAsync(account))
        setPending(false)
      }
    },
    [account, everestToken, dispatch, setPending, toastSuccess, toastError],
  )

  return { onUnlockSummit: handleUnlockSummit, pending }
}


export const usePanicUnlockSummit = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const everestToken = useEverestToken()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handlePanicUnlockSummit = useCallback(
    async () => {
      try {
        setPending(true)
        await panicWithdrawalLockedSummit(everestToken)
        toastSuccess(`SUMMIT Returned`)
      } catch (error) {
        toastError(`Error returning SUMMIT`, (error as Error).message)
      } finally {
        dispatch(fetchEverestDataAsync(account))
        setPending(false)
      }
    },
    [account, everestToken, dispatch, setPending, toastSuccess, toastError],
  )

  return { onPanicUnlockSummit: handlePanicUnlockSummit, pending }
}
