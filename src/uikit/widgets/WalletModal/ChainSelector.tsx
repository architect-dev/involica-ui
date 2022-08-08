import React from 'react'
import styled from 'styled-components'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { CHAIN_ID, getChainLinearGradient } from 'utils'
import { linearGradient } from 'polished'
import { ChainIcon } from 'uikit/components/Svg'
import { pressableMixin } from 'uikit/util/styledMixins'


const AvailableChains = [250, 137]
const getChainUrl = (chain) => {
    if (chain === 250) return 'ftm'
    if (chain === 137) return 'polygon'
    return 'none'
}

const buttonWidth = 42
const buttonHeight = 42

const ToggleWrapper = styled(SelectorWrapperBase)`
    position: relative;
    width: ${buttonWidth * AvailableChains.length}px;
    height: ${buttonHeight}px;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
`

const ChainButton = styled.div<{ selected: boolean }>`
    width: ${buttonWidth}px;
    height: ${buttonHeight}px;
    pointer-events: ${({selected}) => selected ? 'none' : 'default'};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    ${pressableMixin}
`

const StyledChainIcon = styled(ChainIcon)`
    width: ${buttonHeight - 20}px;
    height: ${buttonHeight - 20}px;
`

const SelectedChainButton = styled.div<{ selectedIndex: number, selectedChain: number }>`
    position: absolute;
    width: ${buttonWidth - 4}px;
    height: ${buttonHeight - 4}px;
    top: 2px;
    left: ${({ selectedIndex }) => (selectedIndex * buttonWidth) + 2}px;
    padding: 0px;
    border-radius: 30px;
    box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
    background: ${({ selectedChain }) => linearGradient({
        colorStops: getChainLinearGradient(selectedChain),
        toDirection: '120deg',
    })}};

    display: flex;
    align-items: center;
    justify-content: center;

    pointer-events: none;
`

const ChainOption: React.FC<{ chain: number, selectedChain: number }> = ({ chain, selectedChain }) => {
    return (
        <ChainButton
            as='a'
            href={`https://${getChainUrl(chain)}.summitdefi.com`}
            rel="noreferrer noopener"
            target='_self'
            selected={chain === selectedChain}
        >
            <StyledChainIcon chain={chain}/>
        </ChainButton>
    )
}

const ChainSelector: React.FC = () => {
    const selectedChain = parseInt(CHAIN_ID)
    const selectedIndex = AvailableChains.indexOf(selectedChain)
    return (
        <ToggleWrapper>
            { AvailableChains.map((chain) => (
                <ChainOption key={chain} chain={chain} selectedChain={selectedChain}/>
            ))}
            <SelectedChainButton selectedIndex={selectedIndex} selectedChain={selectedChain}>
                <StyledChainIcon white chain={selectedChain}/>
            </SelectedChainButton>
        </ToggleWrapper>
    )
}

export default React.memo(ChainSelector)
