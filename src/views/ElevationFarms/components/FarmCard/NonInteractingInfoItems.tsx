import { TokenSymbol } from 'config/constants'
import React, { memo } from 'react'
import styled from 'styled-components'
import { Text, Flex, useModal, HeaderInfoQuestion } from 'uikit'
import { pressableMixin } from 'uikit/util/styledMixins'
import TooltipModal, { TooltipModalType } from 'uikit/widgets/Modal/TooltipModal'
import CardValue from 'views/Home/components/CardValue'

const FlexInfoItem = styled.div<{ maxWidth?: number }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    max-width: ${({ maxWidth }) => maxWidth || 88}px;
`

const InfoItemValue = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50px;
`

const PressableFlex = styled(Flex)`
    cursor: pointer;
    gap: 4px;
    ${pressableMixin}
`

export const NonInteractingInfoItems: React.FC<{ symbol: string, depositFeeBP: number, withdrawalFeeBP: number, minWithdrawalFeeBP: number }> = memo(({ symbol, depositFeeBP, withdrawalFeeBP, minWithdrawalFeeBP }) => {
    const isEverest = symbol === TokenSymbol.EVEREST
    const [onPresentTooltipModal] = useModal(
        <TooltipModal tooltipType={TooltipModalType.DecayingWithdrawalFee}/>
    )
    
    return (
        <>
            <FlexInfoItem>
                <Text small bold monospace>DEPOSITED:</Text>
                <InfoItemValue>
                    <CardValue
                        value={0}
                        prefix={isEverest ? undefined : '$'}
                        postfix={isEverest ? 'EVEREST' : undefined}
                        decimals={2}
                        fontSize="18"
                        postfixFontSize='14'
                    />
                </InfoItemValue>
            </FlexInfoItem>
            <FlexInfoItem maxWidth={120}>
                <PressableFlex onClick={onPresentTooltipModal}>
                    <Text small bold monospace>WITHDRAWAL FEE:</Text>
                    <HeaderInfoQuestion/>
                </PressableFlex>
                <InfoItemValue>
                    <Flex alignItems='center' gap='4px'>
                        <Text bold monospace>{withdrawalFeeBP / 100}%</Text>
                        <Text bold monospace fontSize='11px'>{' TO '}</Text>
                        <Text bold monospace>{minWithdrawalFeeBP / 100}%</Text>
                    </Flex>
                    <Flex alignItems='center' gap='4px'>
                        <Text bold monospace fontSize='11px'>{'OVER '}</Text>
                        <Text bold monospace>7</Text>
                        <Text bold monospace fontSize='11px'>{' DAYS'}</Text>
                    </Flex>
                </InfoItemValue>
            </FlexInfoItem>
            <FlexInfoItem>
                <Text small bold monospace>DEPOSIT FEE:</Text>
                <InfoItemValue>
                    <Text bold monospace>{depositFeeBP / 100}%</Text>
                </InfoItemValue>
            </FlexInfoItem>
        </>
    )
})