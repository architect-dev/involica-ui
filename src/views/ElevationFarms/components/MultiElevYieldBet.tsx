import React, { useState } from 'react'
import { getBalanceNumber } from 'utils'
import { Text, Flex, Skeleton } from 'uikit'
import { useMultiElevYieldBetInfo } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import ContributionBreakdown from './ContributionBreakdown'
import { useFarmsUserDataLoaded } from 'state/hooksNew'
import ElevationYieldBet from './ElevationYieldBet'

const MultiElevYieldBet: React.FC = () => {
  const { elevYieldsBreakdown, totalYieldContributed, totalPotentialWinnings } = useMultiElevYieldBetInfo()
  const userDataLoaded = useFarmsUserDataLoaded()

  const rawYieldContributed = getBalanceNumber(totalYieldContributed)
  const rawPotentialWinnings = getBalanceNumber(totalPotentialWinnings)
  const [elevToBreakdown, setElevToBreakdown] = useState<string | undefined>(undefined)


  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex flexDirection='column' alignItems='center' mb='18px' justifyContent='flex-start' width='100%'>
        <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
          <Text bold monospace gold>POTENTIAL WINNINGS:</Text>
          { userDataLoaded ?
            <CardValue
              value={rawPotentialWinnings}
              decimals={3}
              gold
              fontSize="18"
              postfix='SUMMIT'
              postfixFontSize='14'
            /> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
        <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
          <Text bold monospace>ROUND CONTRIBUTION:</Text>
          { userDataLoaded ?
            <CardValue
              value={rawYieldContributed}
              decimals={3}
              fontSize="18"
              postfix='SUMMIT'
              postfixFontSize='14'
            /> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
        <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
          <Text bold monospace small>CONTRIBUTION BREAKDOWN:</Text>
        </Flex>
      </Flex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={elevYieldsBreakdown}
        selectable
        selectedIndex={elevToBreakdown}
        onSelect={setElevToBreakdown}
      />

      {elevToBreakdown != null &&
        <ElevationYieldBet elevation={elevToBreakdown}/>
      }
    </Flex>
  )
}

export default React.memo(MultiElevYieldBet)
