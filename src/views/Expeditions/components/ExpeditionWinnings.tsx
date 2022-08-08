import React, { memo, useCallback } from "react"
import { SummitPalette } from "config/constants"
import useHarvestExpedition from "hooks/useHarvestExpedition"
import { useExpeditionWinnings } from "state/hooksNew"
import { Flex, SummitButton, Text } from "uikit"
import { getBalanceNumber } from "utils"
import CardValue from "views/Home/components/CardValue"
import Divider from "./Divider"


export const ExpeditionWinnings: React.FC = memo(() => {
    const {
        summitWinnings,
        usdcWinnings,
    } = useExpeditionWinnings()
    const { pending, onHarvestExpedition } = useHarvestExpedition()

    const anySummitWinnings = summitWinnings.isGreaterThan(0)
    const anyUsdcWinnings = usdcWinnings.isGreaterThan(0)

    const rawSummitWinnings = getBalanceNumber(summitWinnings)
    const rawUsdcWinnings = getBalanceNumber(usdcWinnings, 6)

    const handleHarvestExpedition = useCallback(() => {
        if (!(anySummitWinnings || anyUsdcWinnings) || pending) return
        onHarvestExpedition()
    }, [anySummitWinnings, anyUsdcWinnings, pending, onHarvestExpedition])

    if (!anySummitWinnings && !anyUsdcWinnings) return null

    return (
        <Flex gap='36px' mt='36px' flexDirection='column' width='100%' maxWidth='650px !important' alignItems='center' justifyContent='center' position='relative'>
            <Flex width='100%' alignItems='center' justifyContent='center'>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text monospace small gold>SUMMIT WINNINGS</Text>
                    <CardValue
                    value={rawSummitWinnings}
                    decimals={3}
                    fontSize='18'
                    postfix='SUMMIT'
                    postfixFontSize='12'
                    gold
                    />
                </Flex>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text monospace small gold>USDC WINNINGS</Text>
                    <CardValue
                    value={rawUsdcWinnings}
                    decimals={2}
                    fontSize='18'
                    postfix='USDC'
                    postfixFontSize='12'
                    gold
                    />
                </Flex>
            </Flex>
            <SummitButton
                disabled={!anySummitWinnings && !anyUsdcWinnings}
                isLoading={pending}
                summitPalette={SummitPalette.GOLD}
                width='240px'
                onClick={handleHarvestExpedition}
            >
                { anySummitWinnings && 'FREEZE SUMMIT' }
                { (anySummitWinnings || anyUsdcWinnings) &&
                <>
                    {' AND'}
                    <br/>
                </>
                }
                { anySummitWinnings && 'HARVEST USDC' }
                { !anySummitWinnings && !anyUsdcWinnings && 'HARVEST WINNINGS'}
            </SummitButton>
            <Divider/>
        </Flex>
    )
})