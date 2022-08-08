import React from 'react'
import Page from 'components/layout/Page'
import BetaTokenCard from './BetaTokenCard'
import styled from 'styled-components'
import { ElevationPuck, ExternalLinkButton, Flex, Text } from 'uikit'
import { getPriceableTokens, TokenSymbol } from 'config/constants'
import BetaRoundRollovers from './BetaRoundRollovers'
import { ChainIncludesBetaTokens } from 'utils'

const BetaTokens = {
  [TokenSymbol.CAKE]: true,
  [TokenSymbol.USDC]: true,
  [TokenSymbol.BIFI]: true,
  [TokenSymbol.GS0]: true,
  [TokenSymbol.GS1]: true,
  [TokenSymbol.GS2]: true,
  [TokenSymbol.GS3]: true,
  [TokenSymbol.GS4]: true,
  [TokenSymbol.GS5]: true,
}

const TokenMintAmounts = {
  [TokenSymbol.CAKE]: 500,
  [TokenSymbol.USDC]: 1000,
  [TokenSymbol.BIFI]: 5,
  [TokenSymbol.GS0]: 2,
  [TokenSymbol.GS1]: 10,
  [TokenSymbol.GS2]: 50,
  [TokenSymbol.GS3]: 500,
  [TokenSymbol.GS4]: 1000,
  [TokenSymbol.GS5]: 20000,
}

const InfoCard = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 16px;
  padding-top: 124px;
  margin: 124px auto 32px auto;
  max-width: 650px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
  gap: 24px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const BetaTokensList: React.FC = () => {
  const priceableTokens = getPriceableTokens()
  const betaTokens = Object.values(priceableTokens).filter((token) => BetaTokens[token.symbol] === true)

  return (
    <Page>
      <InfoCard>
        <ElevationPuck elevation='BASE'>
          <Text bold fontSize='24px'>
            ROLLOVER
            ROUNDS
          </Text>
        </ElevationPuck>
        <Text bold monospace small textAlign='center'>
          This page is used in case the server that handles calling the Rollovers for each elevation goes down while the Summit Team is sleeping. If you need to manually roll over the round, the Summit Team will reimburse you double the gas it cost to execute the rollover.
          <br/>
          <br/>
          You shouldnt ever need to use this, but its software and things can go wrong sometimes.
        </Text>
        { ChainIncludesBetaTokens() &&
        <ExternalLinkButton href='https://testnet.binance.org/faucet-smart'>
            Get Testnet BNB
        </ExternalLinkButton>
        }
      </InfoCard>
      <BetaRoundRollovers/>
      {ChainIncludesBetaTokens() && betaTokens.map((betaToken) => (
        <BetaTokenCard
          key={betaToken.symbol}
          token={betaToken}
          mintAmount={TokenMintAmounts[betaToken.symbol]}
        />
      ))}
    </Page>
  )
}

export default BetaTokensList
