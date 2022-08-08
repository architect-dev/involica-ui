import React from 'react'
import { Text } from 'uikit/components/Text/Text'
import Flex, { MobileColumnFlex } from 'uikit/components/Box/Flex'
import ExternalLinkButton from 'uikit/components/Link/ExternalLinkButton'
import { BN_ZERO, getLinks } from 'config/constants'
import styled from 'styled-components'
import { getFormattedBigNumber, getSummitTokenAddress } from 'utils'
import { useTotalSummitSupply, useBurnedSummitBalance } from 'hooks/useTokenBalance'
import BigNumber from 'bignumber.js'

const InnerCard = styled.div`
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.cardHover};
  padding: 12px;
  height: 90px;
  width: 200px;
  align-items: flex-start;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 180px;
  }
`

interface Props {
  summitPriceUsd?: number
  onDismiss?: () => void
}

const SummitTokenPopUp: React.FC<Props> = ({ summitPriceUsd, onDismiss }) => {
  const { exchange, liquidity, summitTokenLink } = getLinks()
  const summitTokenAddress = getSummitTokenAddress()
  const totalSupply = useTotalSummitSupply()
  const burnedBalance = useBurnedSummitBalance()
  const populatedSummitTokenLink = (summitTokenLink || '').replace('0xSUMMIT', summitTokenAddress)
  const populatedExchangeLink = (exchange || '').replace('0xSUMMIT', summitTokenAddress)
  const populatedLiquidityLink = (liquidity || '').replace('0xSUMMIT', summitTokenAddress)
  const marketCap = (summitPriceUsd ? new BigNumber(summitPriceUsd) : BN_ZERO).times(totalSupply ? totalSupply.minus(burnedBalance || BN_ZERO) : BN_ZERO)


  return (
    <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='12px'>
      <Flex width='100%' justifyContent='flex-start'>
        <Text bold monospace>SUMMIT Token</Text>
      </Flex>
      <MobileColumnFlex gap='12px'>
        <InnerCard>
          <Text monospace mb='-12px'>Price</Text>
          <Text
              fontSize="20px"
              bold
              monospace
            >
              ${summitPriceUsd ? summitPriceUsd.toFixed(3) : 'XX.XX'}
            </Text>
        </InnerCard>
        <InnerCard>
          <ExternalLinkButton href={populatedExchangeLink} onClick={onDismiss}>BUY SUMMIT</ExternalLinkButton>
          <ExternalLinkButton href={populatedLiquidityLink} onClick={onDismiss}>ADD LIQUIDITY</ExternalLinkButton>
          <ExternalLinkButton href={populatedSummitTokenLink} onClick={onDismiss}>SUMMIT CHART</ExternalLinkButton>
        </InnerCard>
      </MobileColumnFlex>
      <MobileColumnFlex gap='12px'>
        <InnerCard>
          <Text monospace mb='-12px'>Market Cap</Text>
          <Text
              fontSize="20px"
              bold
              monospace
            >
              ${getFormattedBigNumber(marketCap)}
            </Text>
        </InnerCard>
        <InnerCard>
        <Text monospace mb='-12px'>Supply</Text>
          <Text
              fontSize="20px"
              bold
              monospace
            >
              {getFormattedBigNumber(totalSupply, 2)}
          </Text>
        </InnerCard>
      </MobileColumnFlex>

    </Flex>
  )
}

export default React.memo(SummitTokenPopUp)
