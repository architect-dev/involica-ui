import React, { useMemo } from 'react'
import { Flex, Text, SummitButton } from 'uikit'
import { BN_ZERO, Elevation, elevationUtils } from 'config/constants/types'
import Totem from '../Totem'
import { elevationPalette } from 'theme/colors'
import { useSelectTotemModal } from 'components/SelectTotemModal'
import { makeSelectFarmBySymbol, useElevationUserTotem, useSelector } from 'state/hooksNew'
import styled from 'styled-components'
import { mix } from 'polished'
import { FarmAPYBreakdown, FarmTotalValue } from '../FarmCard/FarmCardInfoItems'
import BigNumber from 'bignumber.js'


const ElevInfoSection = styled.div<{ elevation?: Elevation }>`
  display: flex;
  flex: 1;
  flex-basis: 360px 100px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme, elevation }) => elevation ?
    mix(0.85, theme.colors.background, theme.colors[elevation]) :
    theme.colors.cardHover
  };
`

interface Props {
  symbol: string
  elevation?: Elevation
}

const FarmInteractionModalElevStats: React.FC<Props> = ({ symbol, elevation }) => {
  const totem = useElevationUserTotem(elevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(elevation)
  const handlePresentSelectTotem = () => {
    onPresentSelectTotemModal()
  }
  const farmBySymbolSelector = useMemo(makeSelectFarmBySymbol, [])
  const farm = useSelector((state) => farmBySymbolSelector(state, symbol))
  const pricePerToken = useSelector((state) => state.prices.pricesPerToken != null ? (state.prices.pricesPerToken[symbol] || new BigNumber(1)) : new BigNumber(1))

  const {
    decimals,
    elevations,
  } = farm
  const {
    supply: lpSupply,
  } = farm.elevations[elevation] || {}


  const totalStaked: BigNumber = useMemo(
    () => {
      let supply = BN_ZERO
      if (elevation == null) {
        elevationUtils.all.forEach((elev) => {
          supply = supply.plus(elevations[elev].supply || BN_ZERO)
        })
      } else {
        supply = lpSupply
      }
      return supply
    },
    [lpSupply, elevation, elevations]
  )

  const [aprTotalValue, summitPerYear]: [BigNumber, BigNumber] = useMemo(
    () => {
      let supply = BN_ZERO
      let sumPerYear = BN_ZERO
      if (elevation == null) {
        // Highest elevation with non-zero staked & non-zero summitPerYear
        const [highestElev] = (Object.entries(elevations)
          .reverse()
          .find(([_, info]) => (info.supply || BN_ZERO).isGreaterThan(0) && (info.summitPerYear || BN_ZERO).isGreaterThan(0))) || [Elevation.PLAINS]

        if (highestElev != null) {
          supply = elevations[highestElev].supply || BN_ZERO
          sumPerYear = elevations[highestElev].summitPerYear || BN_ZERO
        }
        
      } else {
        const { supply: tmpSupply, summitPerYear: tmpSumPerYear } = elevations[elevation]
        supply = tmpSupply ?? BN_ZERO 
        sumPerYear = tmpSumPerYear ?? BN_ZERO
      }

      return [
        supply.div(new BigNumber(10).pow(decimals)).times(pricePerToken),
        sumPerYear,
      ]
    },
    [elevation, elevations, pricePerToken, decimals]
  )

  return (
    <ElevInfoSection elevation={elevation}>
      {elevation != null &&
      <Flex width='33%' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text bold monospace small>
          TOTEM:
        </Text>
        {(totem == null) ? (
          <Flex height='64px' alignItems='center' justifyContent='center' flexDirection='column'>
            <SummitButton width='112px' summitPalette={elevation} onClick={handlePresentSelectTotem}>
              SELECT
              <br/>
              TOTEM
            </SummitButton>
          </Flex>
        ) : (
          <Flex height='64px' alignItems='center' justifyContent='center' flexDirection='column'>
            <Totem
              elevation={elevation}
              totem={totem}
              color={elevationPalette[elevation][2]}
              selected
              pressable={false}
              size='40'
              navSize='40'
            />
          </Flex>
        )}
      </Flex>
      }
      <Flex width='33%' alignItems='flex-start' justifyContent='center'>
        <FarmAPYBreakdown elevation={elevation} summitPerYear={summitPerYear} totalValue={aprTotalValue}/>
      </Flex>
      <Flex width='33%' alignItems='flex-start' justifyContent='center'>
        <FarmTotalValue elevation={elevation} symbol={symbol} totalStaked={totalStaked} pricePerToken={pricePerToken} decimals={decimals}/>
      </Flex>
    </ElevInfoSection>
  )
}

export default FarmInteractionModalElevStats
