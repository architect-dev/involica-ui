import { Elevation } from "config/constants"
import React from "react"
import { useExpeditionApr } from "state/hooksNew"
import styled, { keyframes } from "styled-components"
import { Flex, Text } from "uikit"
import { getPaletteGradientFarmCardBackground } from "utils"
import CardValue from "views/Home/components/CardValue"



const RainbowLight = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`

const ExpeditionAPRWrapper = styled.div`
    background: ${getPaletteGradientFarmCardBackground(Elevation.EXPEDITION)};
    background-size: 200% 200%;
    animation: ${RainbowLight} 4s ease-in-out infinite;
    border-radius: 12px;
    position: absolute;
    top: -6px;
    right: -0px;
    bottom: -6px;
    left: -0px;
`

export const ExpeditionAPRIndicator: React.FC = React.memo(() => {
    const expeditionApr = useExpeditionApr()

    return (
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' position='relative'>
            <ExpeditionAPRWrapper/>
            <Flex flexDirection='row' zIndex={1} justifyContent='space-between' alignItems='center' width='100%' position='relative' padding='0px 12px'>
                <Text bold color='white' monospace small>EXPEDITION APR:</Text>
                <CardValue color='white' value={expeditionApr} postfix='%' decimals={2} fontSize="22" />
            </Flex>
        </Flex>
    )
})