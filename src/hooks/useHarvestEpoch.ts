import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { harvestEpoch } from 'utils'
import { useSummitGlacier } from './useContract'
import { useTransactionToasts } from './useToast'
import { fetchUserEpochsAsync } from 'state/glacier'

export const useHarvestEpoch = (epochIndex: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const summitGlacier = useSummitGlacier()
  const [harvestEpochPending, setHarvestEpochPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()

  const handleHarvestEpoch = useCallback(
    async (amount: string, lockForEverest: boolean) => {
      try {
        setHarvestEpochPending(true)
        await harvestEpoch(summitGlacier, epochIndex, amount, lockForEverest)
        toastSuccess(`Winnings ${lockForEverest ? 'Locked For EVEREST' : 'Harvested'}`)
      } catch (error) {
        toastError(`Error ${lockForEverest ? 'Locking Winnings For EVEREST' : 'Harvesting Winnings'}`, (error as Error).message)
      } finally {
        dispatch(fetchUserEpochsAsync(account))
        setHarvestEpochPending(false)
      }
    },
    [account, epochIndex, dispatch, summitGlacier, setHarvestEpochPending, toastSuccess, toastError],
  )

  return { onHarvestEpoch: handleHarvestEpoch, harvestEpochPending }
}
