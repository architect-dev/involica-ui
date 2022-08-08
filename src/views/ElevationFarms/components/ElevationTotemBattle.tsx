import React from 'react'
import { Elevation } from 'config/constants/types'
import { Flex } from 'uikit'
import TotemBattleBreakdown from './TotemBattleBreakdown'
import { useElevationTotemBattleInfo } from 'state/hooksNew'
import { useSelectTotemModal } from 'components/SelectTotemModal'

const SingleElevationTotemBattle: React.FC<{ elevation: Elevation }> = React.memo(({ elevation }) => {
  const { userTotem, userTotemCrowned, totemInfos } = useElevationTotemBattleInfo(elevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal()

  return (
    <TotemBattleBreakdown
      elevation={elevation}
      totemInfos={totemInfos}
      userTotem={userTotem}
      userTotemCrowned={userTotemCrowned}
      onPresentSelectTotemModal={onPresentSelectTotemModal}
    />
  )
})

const MultiElevTotemBattles: React.FC = () => {
  return (
    <Flex flexDirection='column' width='100%'>
      <SingleElevationTotemBattle elevation={Elevation.PLAINS}/>
      <SingleElevationTotemBattle elevation={Elevation.MESA}/>
      <SingleElevationTotemBattle elevation={Elevation.SUMMIT}/>
    </Flex>
  )
}

export default React.memo(MultiElevTotemBattles)
