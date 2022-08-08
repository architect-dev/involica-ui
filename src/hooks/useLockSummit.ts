import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { increaseLockDuration, increaseLockedSummit, lockSummit } from 'utils'
import { useEverestToken } from './useContract'
import { useTransactionToasts } from './useToast'
import { LockSummitButtonType } from 'state/types'
import BigNumber from 'bignumber.js'
import { fetchEverestDataAsync } from 'state/everest'

export const useLockSummit = (type: LockSummitButtonType, summitAmount: BigNumber | null, duration: number | null) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const everestToken = useEverestToken()
  const [lockSummitPending, setLockSummitPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleLockSummit = useCallback(
    async () => {
      try {
        setLockSummitPending(true)
        const lockDurationSeconds = (duration || 0) * (3600 * 24)
        const summitAmountString = summitAmount.toString()
        switch (type) {
          case LockSummitButtonType.IncreaseLockedSummit:
            await increaseLockedSummit(everestToken, summitAmountString)
            toastSuccess(`Locked SUMMIT Amount Increased`)
            break
          case LockSummitButtonType.IncreaseLockDuration:
            await increaseLockDuration(everestToken, lockDurationSeconds)
            toastSuccess(`SUMMIT Lock Duration Increased`)
            break
          default:
          case LockSummitButtonType.LockSummit:
            await lockSummit(everestToken, summitAmountString, lockDurationSeconds)
            toastSuccess(`SUMMIT locked for EVEREST`)
            break
        }
      } catch (error) {
        switch (type) {
          case LockSummitButtonType.IncreaseLockedSummit:
            toastError(`Error Increasing Locked SUMMIT Amount`, (error as Error).message)
            break
          case LockSummitButtonType.IncreaseLockDuration:
            toastError(`Error Increasing SUMMIT Lock Duration`, (error as Error).message)
            break
          default:
          case LockSummitButtonType.LockSummit:
            toastError(`Error locking SUMMIT for EVEREST`, (error as Error).message)
            break
        }
      } finally {
        dispatch(fetchEverestDataAsync(account))
        setLockSummitPending(false)
      }
    },
    [account, type, summitAmount, duration, everestToken, dispatch, setLockSummitPending, toastSuccess, toastError],
  )

  return { onLockSummit: handleLockSummit, lockSummitPending }
}
