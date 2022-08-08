import React from 'react'
import { Elevation } from "config/constants"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { Flex } from "uikit/components/Box"
import { Text } from '../../../components/Text/Text'
import { SummitButton } from "uikit/components/Button"
import { SUB_MENU_HEIGHT } from "../config"
import { useTotalValue } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import { useExpeditionRoundEmission } from 'state/hooksNew'

const LowerNav = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;
    width: 100vw;
    max-width: 100vw;
    height: ${SUB_MENU_HEIGHT}px;
    background-color: ${({ theme }) => theme.colors.cardHover};
    flex-direction: row;
    gap: 14px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
`

const DesktopOnlyFlex = styled(Flex)`
    display: none;

    ${({ theme }) => theme.mediaQueries.nav} {
        display: flex;
    }
`

export const NavSecondRow: React.FC = () => {
    const totalValue = useTotalValue()
    const { totalUsdDaily } = useExpeditionRoundEmission()

    return (
        <LowerNav>
            <Flex gap='24px'>
                <Flex alignItems='center' gap='6px'>
                    <Text bold monospace>TVL:</Text>
                    <CardValue
                        value={totalValue.toNumber()}
                        prefix="$"
                        decimals={2}
                        fontSize="18"
                        summitPalette={Elevation.OASIS}
                    />
                </Flex>
                <DesktopOnlyFlex alignItems='center' gap='6px'>
                    <Text bold monospace small lineHeight='11px'>
                        DAILY
                        <br/>
                        EXPED:</Text>
                    <CardValue
                        value={totalUsdDaily.toNumber()}
                        decimals={2}
                        fontSize="18"
                        prefix='$'
                        summitPalette={Elevation.OASIS}
                    />
                </DesktopOnlyFlex>
            </Flex>
            <SummitButton
                height='28px'
                summitPalette='PROFILE'
                as={Link}
                to='/portfolio'
                padding='0'
                width='135px'
            >
                PORTFOLIO
            </SummitButton>
        </LowerNav>
    )
}