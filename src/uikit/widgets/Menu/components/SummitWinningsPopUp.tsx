import React, { useCallback } from 'react'
import { Text } from 'uikit/components/Text/Text'
import Flex, { MobileColumnFlex } from 'uikit/components/Box/Flex'
import { SummitPalette } from 'config/constants'
import styled from 'styled-components'
import { getFormattedBigNumber } from 'utils'
import { useFarmsUserDataLoaded, useLifetimeSummitWinningsAndBonus } from 'state/hooksNew'
import { Skeleton } from 'uikit/components/Skeleton'
import { HighlightedText } from 'uikit/components/Text'
import { SummitButton } from 'uikit/components/Button'
import { Link } from 'react-router-dom'
import { useModal } from 'uikit/widgets/Modal'

const InnerCard = styled.div`
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.cardHover};
  padding: 12px;
  height: 100px;
  width: 220px;
  align-items: flex-start;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 200px;
  }
`



const NoShadowHighlightedText = styled(HighlightedText)`
    text-shadow: none;
`

interface Props {
  onDismiss?: () => void
}

const SummitWinningsPopUp: React.FC<Props> = ({ onDismiss }) => {
  const {
    lifetimeSummitWinnings,
    lifetimeSummitBonuses,
    lifetimeSummitWinningsUsd,
    lifetimeSummitBonusesUsd,
    pendingSummitWinnings,
    frozenSummit,
  } = useLifetimeSummitWinningsAndBonus()
  const userDataLoaded = useFarmsUserDataLoaded()
  const rawLifetimeSummitWinnings = getFormattedBigNumber(lifetimeSummitWinnings)
  const rawLifetimeSummitBonuses = getFormattedBigNumber(lifetimeSummitBonuses)
  const rawPendingSummitWinnings = getFormattedBigNumber(pendingSummitWinnings)
  const nothingToClaim = pendingSummitWinnings.isEqualTo(0)
  const rawFrozenSummit = getFormattedBigNumber(frozenSummit)

  return (
    <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='12px'>
      <Flex width='100%' justifyContent='flex-start'>
        <Text bold monospace>SUMMIT Winnings</Text>
      </Flex>
      <MobileColumnFlex gap='12px'>
        <InnerCard>
          <Text monospace mb='6px' lineHeight='14px'>Lifetime Winnings</Text>
          { userDataLoaded ?
              <Flex gap='4px'>
                  <NoShadowHighlightedText bold monospace fontSize='22' lineHeight='22px'>
                      {rawLifetimeSummitWinnings}
                  </NoShadowHighlightedText>
                  <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px'>
                      SUMMIT
                  </NoShadowHighlightedText>
              </Flex> :
              <Skeleton height={24} width={180}/>
          }
          { userDataLoaded ?
              <Flex gap='4px'>
                  <NoShadowHighlightedText bold monospace fontSize='16' lineHeight='16px'>
                      {'$'}{lifetimeSummitWinningsUsd}
                  </NoShadowHighlightedText>
                  <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px'>
                      USD
                  </NoShadowHighlightedText>
              </Flex> :
              <Skeleton height={24} width={180}/>
          }
        </InnerCard>
        <InnerCard>
          <Text monospace mb='6px' lineHeight='14px' gold>Lifetime Bonuses</Text>
          { userDataLoaded ?
              <Flex gap='4px'>
                  <NoShadowHighlightedText bold monospace fontSize='22' lineHeight='22px' gold>
                      {rawLifetimeSummitBonuses}
                  </NoShadowHighlightedText>
                  <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px' gold>
                      SUMMIT
                  </NoShadowHighlightedText>
              </Flex> :
              <Skeleton height={24} width={180}/>
          }
          { userDataLoaded ?
              <Flex gap='4px'>
                  <NoShadowHighlightedText bold monospace fontSize='16' lineHeight='16px' gold>
                      {'$'}{lifetimeSummitBonusesUsd}
                  </NoShadowHighlightedText>
                  <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px' gold>
                      USD
                  </NoShadowHighlightedText>
              </Flex> :
              <Skeleton height={24} width={180}/>
          }
        </InnerCard>
      </MobileColumnFlex>
      <MobileColumnFlex gap='12px'>
        <InnerCard>
          <Text monospace mb='6px' lineHeight='14px'>Pending Winnings</Text>
          { userDataLoaded ?
              <Flex gap='4px'>
                  <NoShadowHighlightedText bold monospace fontSize='22' lineHeight='22px'>
                      {rawPendingSummitWinnings}
                  </NoShadowHighlightedText>
                  <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px'>
                      SUMMIT
                  </NoShadowHighlightedText>
              </Flex> :
              <Skeleton height={24} width={180}/>
          }
          <SummitButton
            height='28px'
            width='100%'
            padding='0px'
            summitPalette={SummitPalette.GOLD}
          >
            <Text monospace small bold color='white'>FREEZE WINNINGS</Text>
          </SummitButton>
        </InnerCard>
        <InnerCard>
          <Text monospace mb='6px' lineHeight='14px'>Frozen SUMMIT</Text>
          { userDataLoaded ?
              <Flex gap='4px'>
                  <NoShadowHighlightedText bold monospace fontSize='22' lineHeight='22px'>
                      {rawFrozenSummit}
                  </NoShadowHighlightedText>
                  <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px'>
                      SUMMIT
                  </NoShadowHighlightedText>
              </Flex> :
              <Skeleton height={24} width={180}/>
          }
          <SummitButton
            height='28px'
            width='100%'
            as={Link}
            to='/glacier'
            replace
            summitPalette={SummitPalette.BASE}
            onClick={onDismiss}
            insetColor='selectorBackground'
            external={false}
          >
            <Text monospace small bold color='white'>OPEN GLACIER</Text>
          </SummitButton>
        </InnerCard>
      </MobileColumnFlex>
    </Flex>
  )
}

export default React.memo(SummitWinningsPopUp)
