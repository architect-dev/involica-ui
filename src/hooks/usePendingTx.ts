import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addPendingTx, removePendingTx } from 'state/summitEcosystem'
import { State } from 'state/types'

export const usePendingTxs = () => {
  return useSelector((state: State) => state.summitEcosystem.pendingTxs)
}

export const useAddRemovePendingTxs = () => {
  const dispatch = useDispatch()
  const addTx = useCallback(
    (hash: string, title: string) => {
      dispatch(addPendingTx(hash, title))
    },
    [dispatch],
  )
  const removeTx = useCallback(
    (hash: string) => {
      dispatch(removePendingTx(hash))
    },
    [dispatch],
  )

  return { addTx, removeTx }
}
