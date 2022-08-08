import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { approve } from 'utils/callHelpers'
import { useERC20 } from './useContract'
import useToast from './useToast'
import { fetchTokensUserDataAsync } from 'state/tokens'
import { fetchEverestDataAsync } from 'state/everest'
import { getCartographerAddress } from 'utils'

// Approve a Farm
export const useApprove = (farmToken: string, tokenName: string) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()
  const lpContract = useERC20(farmToken)

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      await approve(lpContract, getCartographerAddress())
      toastSuccess(`${tokenName} Approved`)
    } catch (error) {
      toastError(`${tokenName} Approval Failed`, (error as Error).message)
    } finally {
      setPending(false)
      dispatch(fetchTokensUserDataAsync(account))
      dispatch(fetchEverestDataAsync(account))
    }
  }, [account, dispatch, lpContract, setPending, toastSuccess, toastError, tokenName])

  return { onApprove: handleApprove, pending }
}

// Approve a Farm
export const useApproveAddress = (farmToken: string, spender: string, tokenName: string) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()
  const lpContract = useERC20(farmToken)

  const handleApprove = useCallback(async () => {
    try {
      setPending(true)
      await approve(lpContract, spender)
      toastSuccess(`${tokenName} Approved`)
    } catch (error) {
      toastError(`${tokenName} Approval Failed`, (error as Error).message)
    } finally {
      setPending(false)
      dispatch(fetchTokensUserDataAsync(account))
      dispatch(fetchEverestDataAsync(account))
    }
  }, [account, dispatch, lpContract, spender, setPending, toastSuccess, toastError, tokenName])

  return { onApprove: handleApprove, pending }
}
