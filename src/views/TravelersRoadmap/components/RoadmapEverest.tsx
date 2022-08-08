import { SummitPalette, TokenSymbol } from "config/constants"
import React from "react"
import { Link } from "react-router-dom"
import { useRoadmapEverestInfoWithPreset } from "state/hooksNew"
import { Flex, SummitButton, Text, TokenSymbolImage } from "uikit"
import { getFormattedBigNumber } from "utils"

const RoadmapEverest: React.FC = () => {
    const { everestOwned, summitLocked, lockDuration, everestLockMult, lockPerc } = useRoadmapEverestInfoWithPreset()
    const rawEverestOwned = getFormattedBigNumber(everestOwned)
    const rawSummitLocked = getFormattedBigNumber(summitLocked)
    return (
        <Flex width='100%' gap='16px' flexDirection='column' alignItems='center' justifyContent='center'>
            <TokenSymbolImage symbol={TokenSymbol.EVEREST} width={124} height={124}/>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace bold>EVEREST OWNED:</Text>
                <Flex alignItems='center' justifyContent='center' gap='6px'>
                    <Text italic fontSize='20px' bold monospace>{rawEverestOwned}</Text>
                    <Text small bold monospace>EVEREST</Text>
                </Flex>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace bold>SUMMIT LOCKED:</Text>
                <Flex alignItems='center' justifyContent='center' gap='6px'>
                    <Text italic fontSize='20px' bold monospace>{rawSummitLocked}</Text>
                    <Text small bold monospace>SUMMIT</Text>
                </Flex>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace>% of your SUMMIT Locked:</Text>
                <Text bold monospace>{lockPerc}</Text>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace>Lock Duration:</Text>
                <Text bold monospace>{lockDuration}D</Text>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace>Lock Multiplier:</Text>
                <Text bold monospace>{everestLockMult != null ? `${(everestLockMult / 10000).toFixed(2)}X` : '--'}</Text>
            </Flex>

            <SummitButton
                summitPalette={SummitPalette.EVEREST}
                as={Link}
                to='/everest'
                replace
                marginTop='18px'
            >
                OPEN EVEREST PAGE
            </SummitButton>
        </Flex>
    )
}

export default React.memo(RoadmapEverest)