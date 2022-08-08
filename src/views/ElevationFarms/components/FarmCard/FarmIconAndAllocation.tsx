import React, { memo } from "react";
import { TokenLpSource } from "config/constants";
import styled from "styled-components";
import { Flex, Tag, Text, TokenSymbolImage } from "uikit";

const MultiplierTagItem = styled(Tag)`
    font-family: Courier Prime, monospace;
    font-size: 11px;
    min-width: 42px;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.OASIS};
    border-color: ${({ theme }) => theme.colors.OASIS};
`

const MultiplierTag: React.FC<{ allocation: number }> = memo(({ allocation }) => {
    return (
        <MultiplierTagItem variant="secondary">
            {((allocation) / 100)}X
        </MultiplierTagItem>
    )
})

interface Props {
    symbol: string
    lpSource?: TokenLpSource
    name?: string
    allocation: number
    live: boolean
    noIcon?: boolean
}

const FarmIconAndAllocation: React.FC<Props> = ({ symbol, lpSource, name, allocation, live, noIcon = false }) => {
    return (
        <Flex gap='8px' width='180px' justifyContent="flex-start" alignItems="center">
            { !noIcon && <TokenSymbolImage symbol={symbol} width={52} height={52} /> }
            <Flex flexDirection="column" alignItems="flex-start">
                <Text italic monospace bold fontSize="15px" lineHeight="14px" mb={lpSource != null ? '0px' : '4px'} textAlign="left">
                    {name || symbol}
                </Text>
                { lpSource != null && <Text monospace bold italic fontSize='10px' mb="4px">{lpSource}</Text> }
                <MultiplierTag allocation={live ? allocation : 0}/>
            </Flex>
        </Flex>
    )
}

export default React.memo(FarmIconAndAllocation)