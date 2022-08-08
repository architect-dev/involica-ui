import { ElevationsRolledOverModal } from 'components/ElevationsModals/ElevationsRolledOverModal'
import React, { useEffect } from 'react'
import { useElevationRolloversToShow } from 'state/hooksNew'
import { useModal } from 'uikit'

const RoundRolloversTracker: React.FC = () => {
  const elevationRolloversToShow = useElevationRolloversToShow()

  const [onPresentElevationRolledOverModal] = useModal(
    <ElevationsRolledOverModal />,
  )

  useEffect(
    () => {
      if (elevationRolloversToShow.length === 0) return
      onPresentElevationRolledOverModal({
        elevations: elevationRolloversToShow
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elevationRolloversToShow]
  )
  return null
}

export default React.memo(RoundRolloversTracker)
