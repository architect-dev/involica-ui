import React, { useCallback, useState } from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex, Skeleton, HighlightedText, useModal, MobileColumnFlex } from 'uikit'
import styled from 'styled-components'
import { useAllElevationsClaimable } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import { SummitPalette } from 'config/constants'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useFarmsUserDataLoaded } from 'state/hooksNew'
import ElevationWinnings from './ElevationWinnings'


const StyledMobileColumnFlex = styled(MobileColumnFlex)`
  gap: 6px;
  ${({ theme }) => theme.mediaQueries.nav} {
    gap: 24px;
  }
`


const NoTextShadowFlex = styled(Flex)`
  gap: 4px;
  > * {
    text-shadow: none !important;
  }
`

const MultiElevWinningsAndClaim: React.FC = () => {
  const { totalClaimable, totalClaimableBonus, claimableBreakdown } = useAllElevationsClaimable()
  const rawTotalClaimable = getBalanceNumber(totalClaimable)
  const rawTotalClaimableBonus = getBalanceNumber(totalClaimableBonus)
  const userDataLoaded = useFarmsUserDataLoaded()
  const nothingToClaim = totalClaimable.isEqualTo(0)
  const [elevToBreakdown, setElevToBreakdown] = useState<string | undefined>(undefined)

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column' mb='18px'>
      <StyledMobileColumnFlex alignItems='center' mb='18px' justifyContent='center' width='100%'>

        <Flex flexDirection='column' alignItems='center' justifyContent='center'>
          <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
            <Text bold monospace>WINNINGS:</Text>
            { userDataLoaded ?
              <CardValue
                value={rawTotalClaimable}
                decimals={3}
                fontSize="18"
                postfix='SUMMIT'
                postfixFontSize='14'
              /> :
              <Skeleton height={24} width={180}/>
            }
          </Flex>
          <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
            <Text bold monospace gold small>BONUSES:</Text>
            { userDataLoaded ?
              <NoTextShadowFlex>
                <HighlightedText bold monospace gold fontSize='14px'>+</HighlightedText>
                <CardValue
                  value={rawTotalClaimableBonus}
                  decimals={3}
                  fontSize="14"
                  gold
                />
                <HighlightedText bold monospace gold fontSize='14px' ml='8px'>BONUS</HighlightedText>
              </NoTextShadowFlex> :
              <Skeleton height={24} width={180}/>
            }
          </Flex>
        </Flex>
        <SummitButton
          summitPalette={SummitPalette.GOLD}
          disabled={nothingToClaim}
          width='200px'
        >
          FREEZE WINNINGS
        </SummitButton>
      </StyledMobileColumnFlex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={claimableBreakdown}
        selectable
        selectedIndex={elevToBreakdown}
        onSelect={setElevToBreakdown}
      />

      {elevToBreakdown != null &&
        <ElevationWinnings elevation={elevToBreakdown}/>
      }
    </Flex>
  )
}

export default React.memo(MultiElevWinningsAndClaim)
