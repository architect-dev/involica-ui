import React from 'react'
import styled from 'styled-components'
import { Elevation, elevationUtils } from 'config/constants/types'
import { Flex } from 'uikit'
import { useSelectedElevation } from 'state/hooks'
import Totem from './Totem'
import SelectedTotem from '../../../uikit/components/Totem/SelectedTotem'
import { elevationPalette } from 'theme/colors'
import chroma from 'chroma-js'
import { useElevationUserTotem } from 'state/hooksNew'

const HeaderWrapper = styled(Flex)`
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  max-width: 650px;
`

const FlexGap = styled(Flex)``

const TotemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const renderTotems = (elevation: Elevation, totems: number[], selectedTotem: number, gradient: any) => {
  switch (elevation) {
    case Elevation.SUMMIT:
      return (
        <>
          <FlexGap flexDirection="row" justifyContent="center">
            {totems.slice(0, 5).map((totem, i) => (
              <Totem key={totem} elevation={elevation} totem={totem} color={gradient[i]} />
            ))}
          </FlexGap>
          <Flex flexDirection="row" justifyContent="center">
            {totems.slice(5, 7).map((totem, i) => (
              <Totem key={totem} elevation={elevation} totem={totem} color={gradient[i + 5]} />
            ))}
            <SelectedTotem disabled elevation={elevation} totem={selectedTotem} />
            {totems.slice(7, 9).map((totem, i) => (
              <Totem key={totem} elevation={elevation} totem={totem} color={gradient[i + 7]} />
            ))}
          </Flex>
        </>
      )
    case Elevation.MESA:
      return (
        <Flex flexDirection="row" justifyContent="center">
          {totems.slice(0, 2).map((totem, i) => (
            <Totem key={totem} elevation={elevation} totem={totem} color={gradient[i]} />
          ))}
          <SelectedTotem disabled elevation={elevation} totem={selectedTotem} />
          {totems.slice(2, 4).map((totem, i) => (
            <Totem key={totem} elevation={elevation} totem={totem} color={gradient[i + 2]} />
          ))}
        </Flex>
      )
    case Elevation.PLAINS:
      return (
        <Flex flexDirection="row" justifyContent="center">
          {selectedTotem === 0 ? (
            <SelectedTotem disabled elevation={elevation} totem={selectedTotem} />
          ) : (
            <Totem elevation={elevation} totem={0} color={gradient[0]} />
          )}
          {selectedTotem === 1 ? (
            <SelectedTotem disabled elevation={elevation} totem={selectedTotem} />
          ) : (
            <Totem elevation={elevation} totem={1} color={gradient[0]} />
          )}
        </Flex>
      )
    default:
    case Elevation.OASIS:
      return <SelectedTotem disabled elevation={elevation} totem={0} />
  }
}

const Totems: React.FC = () => {
  const elevation = useSelectedElevation()
  const selectedTotem = useElevationUserTotem(elevation)
  if (elevation == null) return null
  const remainingTotems = elevationUtils.totemsArray(elevation).filter((totem) => totem !== selectedTotem)
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(remainingTotems.length)
  return (
    <>
      <TotemsWrapper>{renderTotems(elevation, remainingTotems, selectedTotem, colorGradient)}</TotemsWrapper>
    </>
  )
}

export default React.memo(Totems)
