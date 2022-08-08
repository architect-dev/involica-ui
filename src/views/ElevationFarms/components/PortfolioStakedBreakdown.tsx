import React from 'react'
import { Flex, HighlightedText, Skeleton, Text } from 'uikit'
import { useMultiElevStaked } from 'state/hooks'
import ContributionBreakdown from './ContributionBreakdown'
import { useFarmsUserDataLoaded } from 'state/hooksNew'
import ElevationStaked from './ElevationStaked'

const PortfolioStakedBreakdown: React.FC = () => {
  const { totalTVL, tvlContributions } = useMultiElevStaked()
  const userDataLoaded = useFarmsUserDataLoaded()

  return (
    <Flex width='100%' alignItems='flex-start' justifyContent='center' flexDirection='column'>
      <Flex flexDirection='column' alignItems='flex-start' justifyContent='flex-start' width='100%'>
        <Flex justifyContent='center' alignItems='center' height='20px' gap='4px'>
          <Text bold monospace>USER STAKED:</Text>
          { userDataLoaded ?
            <HighlightedText header bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
              {'$'}{totalTVL.toFixed(2)}
            </HighlightedText> :
            <Skeleton height={24} width={180}/>
          }
        </Flex>
      </Flex>

      <Text bold monospace small italic mt='16px' mb='8px'>ELEVATION BREAKDOWN:</Text>
      <ContributionBreakdown
        loaded={userDataLoaded}
        contributions={tvlContributions}
      />

      <Text bold monospace small italic mt='16px' mb='-20px'>FARM BREAKDOWN:</Text>
      <ElevationStaked/>
    </Flex>
  )
}

export default React.memo(PortfolioStakedBreakdown)
