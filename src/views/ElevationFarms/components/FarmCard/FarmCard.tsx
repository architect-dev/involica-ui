import React, { useMemo, useRef } from 'react'
import BigNumber from 'bignumber.js'
import styled, { css } from 'styled-components'
import { Flex, Text, useModal } from 'uikit'
import { BN_ZERO, Elevation, elevationUtils } from 'config/constants/types'
import FarmIconAndAllocation from './FarmIconAndAllocation'
import FarmStakingContribution, { ElevationsStaked } from './FarmStakingContribution'
import { makeSelectFarmBySymbol, useSelector, useFarmsUserDataLoaded, useFarmFilters } from 'state/hooksNew'
import { FarmAPYBreakdown, FarmTotalValue } from './FarmCardInfoItems'
import { FarmRetiredSash } from './FarmRetiredSash'
import { getFarmInteracting, getFarmType } from 'utils'
import { FarmType } from 'state/types'
import FarmCardTokenSection from './FarmCardTokenSection'
import { NonInteractingInfoItems } from './NonInteractingInfoItems'
import FarmInteractionModal from '../FarmInteractionModal/FarmInteractionModal'

const FCard = styled(Flex)<{ $locked: boolean; interacting: boolean }>`
  cursor: pointer;
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
  transition: all 250ms;
  width: 100%;
  scroll-margin: 156px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom-width: ${({ interacting }) => interacting ? 0 : 1}px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.text};

  .marker-text {
    background-color: ${({ theme }) => theme.colors.background};
  }

  ${({ interacting }) =>
    interacting &&
    css`
      margin-bottom: 24px;
      border-bottom-width: 0px;
    `}

  &:first-child {
    margin-top: 0px;
  }


  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
    box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
    z-index: 10;

    .marker-text {
      background-color: ${({ theme }) => theme.colors.cardHover};
    }

    .styledAccent {
      filter: blur(12px);
    }
  }
`

const PressableFlex = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 16px 20px 16px 20px;
  transition: all 250ms;
  flex-wrap: wrap;
`

const FarmNumericalInfoFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  width: 100%;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`



interface FarmCardProps {
  symbol: string
}

const FarmCard: React.FC<FarmCardProps> = ({ symbol }) => {
  const { farmType, liveFarms } = useFarmFilters()
  const farmBySymbolSelector = useMemo(makeSelectFarmBySymbol, [])
  const farm = useSelector((state) => farmBySymbolSelector(state, symbol))
  const pricePerToken = useSelector((state) => state.prices.pricesPerToken != null ? (state.prices.pricesPerToken[symbol] || new BigNumber(1)) : new BigNumber(1))
  const userDataLoaded = useFarmsUserDataLoaded()
  const cardRef = useRef(null)

  const {
    name,
    lpSource,
    allocation,
    decimals,
    elevations,
    comment: farmComment,
    warning: farmWarning,
    depositFeeBP,
    taxBP: maxWithdrawalFeeBP,
    native,
  } = farm

  const [onPresentFarmInteractions] = useModal(
    <FarmInteractionModal
      symbol={symbol}
    />,
  )

  const interacting = useMemo(
    () => getFarmInteracting(farm),
    [farm],
  )

  const farmElevationsStaked = useMemo(
    (): ElevationsStaked => elevationUtils.all.reduce((acc, elev) => ({
      ...acc,
      [elev]: elevations[elev]?.stakedBalance || BN_ZERO,
    }), {
      [Elevation.OASIS]: BN_ZERO,
      [Elevation.PLAINS]: BN_ZERO,
      [Elevation.MESA]: BN_ZERO,
      [Elevation.SUMMIT]: BN_ZERO,
    }),
    [elevations]
  )

  const totalStaked: BigNumber = useMemo(
    () => {
      let supply = BN_ZERO
      elevationUtils.all.forEach((elev) => {
        supply = supply.plus(elevations[elev].supply || BN_ZERO)
      })
      return supply
    },
    [elevations]
  )

  const [aprTotalValue, summitPerYear]: [BigNumber, BigNumber] = useMemo(
    () => {
      let supply = BN_ZERO
      let sumPerYear = BN_ZERO

      // Highest elevation with non-zero staked & non-zero summitPerYear
      const [highestElev] = (Object.entries(elevations)
        .reverse()
        .find(([_, info]) => (info.supply || BN_ZERO).isGreaterThan(0) && (info.summitPerYear || BN_ZERO).isGreaterThan(0))) || [Elevation.PLAINS]

      if (highestElev != null) {
        supply = elevations[highestElev].supply || BN_ZERO
        sumPerYear = elevations[highestElev].summitPerYear || BN_ZERO
      }

      return [
        supply.div(new BigNumber(10).pow(decimals)).times(pricePerToken),
        sumPerYear,
      ]
    },
    [elevations, pricePerToken, decimals]
  )

  const retired = (allocation === 0 || symbol === 'BOO') // TODO: remove this
  const liveFilterShow = (interacting && liveFarms) || (liveFarms !== retired)
  if (!liveFilterShow) return null

  const farmTypeShow = farmType === FarmType.All || getFarmType(farm) === farmType
  if (!farmTypeShow) return null


  return (
    <FCard $locked={false} ref={cardRef} interacting={interacting} onClick={onPresentFarmInteractions}>
      <PressableFlex>
        { farmComment != null && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* {farmComment}</Text> }
        { farmWarning != null && <Text monospace bold italic fontSize='13px' color='red' mb='14px' textAlign='center'>* {farmWarning}</Text> }
        <FarmNumericalInfoFlex>
          <FarmIconAndAllocation symbol={symbol} lpSource={lpSource} name={name} allocation={allocation} live={allocation > 0}/>
          { interacting ?
            <FarmStakingContribution symbol={symbol} userDataLoaded={userDataLoaded} elevationsStaked={farmElevationsStaked} pricePerToken={pricePerToken} decimals={decimals}/> :
            <NonInteractingInfoItems symbol={symbol} depositFeeBP={depositFeeBP} withdrawalFeeBP={maxWithdrawalFeeBP} minWithdrawalFeeBP={native ? 0 : 50}/>
          }
          <FarmAPYBreakdown summitPerYear={summitPerYear} totalValue={aprTotalValue}/>
          <FarmTotalValue symbol={symbol} totalStaked={totalStaked} pricePerToken={pricePerToken} decimals={decimals}/>
        </FarmNumericalInfoFlex>
      </PressableFlex>

      { retired && <FarmRetiredSash/> }

      { interacting &&
        <>
          <Divider />
          <FarmCardTokenSection
            symbol={symbol}
          />
        </>
      }
    </FCard>
  )
}

export default React.memo(FarmCard)
