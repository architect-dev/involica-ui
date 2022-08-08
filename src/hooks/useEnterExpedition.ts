import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { useExpedition } from './useContract'
import { useTransactionToasts } from './useToast'
import { fetchExpeditionPublicDataAsync, fetchExpeditionUserDataAsync } from 'state/expedition'
import { enterExpedition } from 'utils'

export const useEnterExpedition = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const expedition = useExpedition()
  const [entryPending, setEntryPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleEnterExpedition = useCallback(
    async () => {
      try {
        setEntryPending(true)
        await enterExpedition(expedition)
        toastSuccess('Entered the EXPEDITION')
      } catch (error) {
        toastError('Entering the EXPEDITION Failed', (error as Error).message)
      } finally {
        dispatch(fetchExpeditionUserDataAsync(account))
        dispatch(fetchExpeditionPublicDataAsync())
        setEntryPending(false)
      }
    },
    [account, dispatch, expedition, setEntryPending, toastSuccess, toastError],
  )

  return { onEnterExpedition: handleEnterExpedition, entryPending }
}
