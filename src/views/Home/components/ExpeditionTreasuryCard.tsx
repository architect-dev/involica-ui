import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Card, CardBody, HighlightedText } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { Elevation, SummitPalette } from 'config/constants'
import { InverseDeity } from 'views/ElevationFarms/components/InverseDeity'
import CardValue from './CardValue'
import { Link } from 'react-router-dom'
import { ExpeditionAPRIndicator } from 'views/Everest/components/ExpeditionAPRIndicator'
import { useExpeditionPotTotalValue, useExpeditionDisbursedValue } from 'state/hooksNew'

const StyledFarmStakingCard = styled(Card)`
    min-height: 376px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
`

const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
    letter-spacing: ${({ letterSpacing }) => letterSpacing};
    font-weight: 900;
    font-size: ${({ fontSize }) => fontSize};
    text-shadow: none;
    z-index: 2;
`

const ExpeditionTreasuryCard: React.FC = () => {
    const expeditionPotTotalValue = useExpeditionPotTotalValue()
    const expeditionDisbursedValue = useExpeditionDisbursedValue()

    return (
        <StyledFarmStakingCard>
            <CardBody style={{height: '100%', display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                <InverseDeity deity={0} selected inverted />

                <StyledHighlightedText fontSize="16px" mt='-32px' letterSpacing="2px">
                    EXPEDITION TREASURY:
                </StyledHighlightedText>
                <CardValue
                    value={expeditionPotTotalValue}
                    prefix="$"
                    decimals={2}
                    fontSize="40"
                    gold
                    summitPalette={Elevation.OASIS}
                />

                <StyledHighlightedText fontSize="14px" letterSpacing="2px" mt='8px' mb='0px'>
                    DISBURSED TO DATE:
                </StyledHighlightedText>
                <CardValue
                    value={expeditionDisbursedValue}
                    prefix="$"
                    decimals={2}
                    fontSize="26"
                    gold
                    summitPalette={Elevation.OASIS}
                />

                <Flex mt='12px' mb='12px' width='95%'>
                    <ExpeditionAPRIndicator/>
                </Flex>

                <Text textAlign='center' bold monospace italic mt='8px'>
                    100% of the Expedition Treasury
                    will be given back exclusively to
                    EVEREST holders
                    through daily EXPEDITIONS.
                </Text>

                <Flex alignItems='center' justifyContent='center' gap='12px' mt='12px'>
                    <SummitButton
                        summitPalette={SummitPalette.EVEREST}
                        as={Link}
                        to='/everest'
                        replace
                        mt='12px'
                    >
                        GET EVEREST
                    </SummitButton>
                    <SummitButton
                        summitPalette={SummitPalette.EXPEDITION}
                        as={Link}
                        to='/expedition'
                        replace
                        mt='12px'
                    >
                        JOIN EXPEDITION
                    </SummitButton>
                </Flex>
            </CardBody>
        </StyledFarmStakingCard>
  )
}

export default React.memo(ExpeditionTreasuryCard)
