import React, { memo } from "react"
import { useExpeditionStatsInfo } from "state/hooksNew"
import styled from "styled-components"
import { Flex, MobileColumnFlex, Text } from "uikit"
import { getFormattedBigNumber } from "utils"


const ValueText = styled(MobileColumnFlex)`
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;

    ${({ theme }) => theme.mediaQueries.nav} {
        gap: 6px;
        margin-bottom: 0px;
    }
`

export const ExpeditionStats: React.FC = memo(() => {
    const {
        everestStaked,
    
        summitRoundEmission,
        summitDistributed,
    
        usdcRoundEmission,
        usdcDistributed,
    
        averageFaith,
    } = useExpeditionStatsInfo()

    const rawEverestStaked = getFormattedBigNumber(everestStaked, 3)

    const rawSummitRoundEmission = getFormattedBigNumber(summitRoundEmission, 2)
    const rawSummitDistributed = getFormattedBigNumber(summitDistributed, 2)

    const rawUsdcRoundEmission = getFormattedBigNumber(usdcRoundEmission, 2, 6)
    const rawUsdcDistributed = getFormattedBigNumber(usdcDistributed, 2, 6)

    return (
        <Flex gap='36px' mt='36px' flexDirection='column' width='100%' maxWidth='650px !important' alignItems='center' justifyContent='center' position='relative'>
            <Flex width='100%' alignItems='center' justifyContent='center'>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text monospace small>TOTAL EVEREST STAKED</Text>
                    <Flex gap='6px' flexDirection='row' alignItems='center' justifyContent='center'>
                        <Text bold monospace fontSize='16px'>
                                {rawEverestStaked}
                        </Text>
                        <Text bold monospace small>
                                EVEREST
                        </Text>
                    </Flex>
                </Flex>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text monospace small>AVERAGE FAITH</Text>
                    <Text bold monospace fontSize='16px'>
                            {averageFaith || '-'}
                    </Text>
                </Flex>
            </Flex>
    
            <Flex width='100%' gap='8px' alignItems='center' justifyContent='center'>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text monospace small>REWARD TOKEN: SUMMIT</Text>
                    <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                        <ValueText>
                            <Text bold monospace small>
                                EMISSION PER ROUND:
                            </Text>
                            <Text bold monospace fontSize='16px'>
                                {rawSummitRoundEmission}
                            </Text>
                        </ValueText>
                        <ValueText>
                            <Text bold monospace small>
                                DISBURSED TO DATE:
                            </Text>
                            <Text bold monospace fontSize='16px'>
                                {rawSummitDistributed}
                            </Text>
                        </ValueText>
                    </Flex>
                </Flex>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text monospace small>REWARD TOKEN: USDC</Text>
                    <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                        <ValueText>
                            <Text bold monospace small>
                                EMISSION PER ROUND:
                            </Text>
                            <Text bold monospace fontSize='16px'>
                                {rawUsdcRoundEmission}
                            </Text>
                        </ValueText>
                        <ValueText>
                            <Text bold monospace small>
                                DISBURSED TO DATE:
                            </Text>
                            <Text bold monospace fontSize='16px'>
                                {rawUsdcDistributed}
                            </Text>
                        </ValueText>
                    </Flex>
                </Flex>
            </Flex>
    
        </Flex>
    )
})