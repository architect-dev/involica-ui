import React, { useState } from 'react'
import { Flex, HighlightedText, Skeleton, Text } from 'uikit'
import { useMultiElevStaked } from 'state/hooks'
import ContributionBreakdown from './ContributionBreakdown'
import { useFarmsUserDataLoaded } from 'state/hooksNew'
import ElevationStaked from './ElevationStaked'

const MultiElevStaked: React.FC = () => {
  const { totalTVL, tvlContributions } = useMultiElevStaked()
  const userDataLoaded = useFarmsUserDataLoaded()
  const [elevToBreakdown, setElevToBreakdown] = useState<string | undefined>(undefined)

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex flexDirection='column' alignItems='center' mb='18px' justifyContent='flex-start' width='100%'>
        <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
          <Text bold monospace>STAKED:</Text>
          { userDataLoaded ?
            <HighlightedText bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
              {'$'}{totalTVL.toFixed(2)}
            </HighlightedText> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
      </Flex>

      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={tvlContributions}
        selectable
        selectedIndex={elevToBreakdown}
        onSelect={setElevToBreakdown}
      />

      {elevToBreakdown != null &&
        <ElevationStaked elevation={elevToBreakdown}/>
      }
    </Flex>
  )
}

export default React.memo(MultiElevStaked)
