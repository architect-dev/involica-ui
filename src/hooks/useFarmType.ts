import { useSelector, useDispatch } from 'react-redux'
import { FarmType, State } from 'state/types'
import { updateFarmType, updateLiveFarms } from 'state/summitEcosystem'
import { useCallback } from 'react'

export const useFarmType = () => {
  const farmType = useSelector((state: State) => state.summitEcosystem.farmType)
  const liveFarms = useSelector((state: State) => state.summitEcosystem.liveFarms)
  const dispatch = useDispatch()

  const onSetFarmType = useCallback(
    (newFarmType: FarmType) => {
      if (newFarmType === farmType) return
      dispatch(updateFarmType(newFarmType))
    },
    [dispatch, farmType],
  )

  const onSetLive = useCallback(
    (newLive: boolean) => {
      if (newLive === liveFarms) return
      dispatch(updateLiveFarms(newLive))
    },
    [dispatch, liveFarms],
  )

  return {
    farmType,
    liveFarms,
    onSetFarmType,
    onSetLive,
  }
}
