import React, { memo } from 'react'
import { useGlacierTotalFrozenSummit, useGlacierTotalThawedSummit } from 'state/hooksNew'
import styled from 'styled-components'
import { HighlightedText, MobileColumnFlex, Text, TokenSymbolImage } from 'uikit'
import { getFormattedBigNumber } from 'utils'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    width: 100%;
    margin-top: -30px;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        margin-top: -141px;
    }
`

const ItemFlex = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
`

const Spacer = styled.div`
    flex: 0.75;
    height: 10px;
    display: none;

    ${({ theme }) => theme.mediaQueries.nav} {
        display: flex;
    }
`

const ValueText = styled(MobileColumnFlex)`
    margin-top: 8px;
    ${({ theme }) => theme.mediaQueries.nav} {
        gap: 6px;
    }
`

const NoShadowHighlightedText = styled(HighlightedText)`
    text-shadow: none;
`

const SummitIconSize = 60

export const GlacierTotalSummitAmounts: React.FC = memo(() => {
    const totalFrozenSummit = useGlacierTotalFrozenSummit()
    const totalThawedSummit = useGlacierTotalThawedSummit()
    const rawTotalFrozenSummit = getFormattedBigNumber(totalFrozenSummit)
    const rawTotalThawedSummit = getFormattedBigNumber(totalThawedSummit)

    return (
        <Wrapper>
            <ItemFlex>
                <TokenSymbolImage symbol='FrozenSUMMIT' width={SummitIconSize} height={SummitIconSize} />
                <Text bold monospace small>
                    YOUR FROZEN SUMMIT
                </Text>
                <ValueText>
                    <NoShadowHighlightedText bold monospace fontSize='22' lineHeight='22px'>
                        {rawTotalFrozenSummit}
                    </NoShadowHighlightedText>
                    <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px'>
                        SUMMIT
                    </NoShadowHighlightedText>
                </ValueText>
            </ItemFlex>
            <Spacer/>
            <ItemFlex>
                <TokenSymbolImage symbol='ThawedSUMMIT' width={SummitIconSize} height={SummitIconSize} />
                <Text bold monospace small>
                    YOUR THAWED SUMMIT
                </Text>
                <ValueText>
                    <NoShadowHighlightedText bold monospace fontSize='22' lineHeight='22px'>
                        {rawTotalThawedSummit}
                    </NoShadowHighlightedText>
                    <NoShadowHighlightedText monospace fontSize='14' lineHeight='14px'>
                        SUMMIT
                    </NoShadowHighlightedText>
                </ValueText>
            </ItemFlex>
        </Wrapper>
    )
})