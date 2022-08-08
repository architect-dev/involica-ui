import BigNumber from 'bignumber.js'
import { Elevation, TokenSymbol } from 'config/constants'
import React, { memo, useMemo } from 'react'
import { useSummitPrice } from 'state/hooksNew'
import styled from 'styled-components'
import { Skeleton, Text } from 'uikit'
import { nFormatter } from 'utils'

const FlexInfoItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    max-width: 88px;
`

const InfoItemValue = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 64px;
`

interface Props {
    elevation?: Elevation
    summitPerYear: BigNumber
    totalValue: BigNumber
}

export const FarmAPYBreakdown: React.FC<Props> = memo(({ elevation, summitPerYear, totalValue }) => {
    const summitPrice = useSummitPrice() || new BigNumber(10)

    const earningsPerYear = summitPrice.times(summitPerYear).dividedBy(new BigNumber(10).pow(16))
    const apr = earningsPerYear.dividedBy((totalValue != null && totalValue.isGreaterThan(0)) ? totalValue : new BigNumber(1)).toNumber()

    const apy = useMemo(
        () => ((1 + (apr / 100) / 365) ** 365 - 1) * 100,
        [apr]
    )

    const dailyAPR = (apr && apr / 365)
    
    const apyText = `${elevation == null ? 'BASE' : elevation} APY`

    const yearlyApyText = `${nFormatter(apy)}%`
    const dailyApyText = `${nFormatter(dailyAPR)}%`

    
    return (
        <FlexInfoItem>
            <Text bold monospace small style={{ whiteSpace: 'nowrap' }}>{apyText}:</Text>
            <InfoItemValue>
                { elevation == null &&
                    <Text bold monospace fontSize='11px' mt='8px' style={{ display: 'flex', alignItems: 'center', lineHeight: '10px' }}>
                            UP TO
                    </Text>
                }
                <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '12px' }}>
                        {yearlyApyText || <Skeleton height={24} width={80} />}
                </Text>
                <Text bold monospace fontSize='11px' mt='8px' style={{ display: 'flex', alignItems: 'center', lineHeight: '10px' }}>
                        DAILY APR
                </Text>
                <Text bold monospace small style={{ display: 'flex', alignItems: 'center', lineHeight: '11px' }}>
                        {dailyApyText || <Skeleton height={24} width={80} />}
                </Text>
            </InfoItemValue>
        </FlexInfoItem>
    )
})

export const FarmTotalValue: React.FC<{ elevation?: Elevation, symbol: string, totalStaked: BigNumber, pricePerToken: BigNumber, decimals: number }> = memo(({ elevation, symbol, totalStaked, pricePerToken, decimals }) => {
    const isEverest = symbol === TokenSymbol.EVEREST
    const totalValue = totalStaked.div(new BigNumber(10).pow(decimals)).times(isEverest ? 1 : pricePerToken)

    const totalValueFormatted = totalValue
        ? `${isEverest ? '' : '$'}${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '-'

    const tvlText = `${elevation == null ? 'TOTAL' : elevation} TVL`

    return (
        <FlexInfoItem>
            <Text bold monospace small style={{ whiteSpace: 'nowrap' }}>{tvlText}:</Text>
            <InfoItemValue>
                <Text bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                    {totalValueFormatted}
                    {isEverest && <br/>}
                    {isEverest && 'EVEREST'}
                </Text>
            </InfoItemValue>
        </FlexInfoItem>
    )
})