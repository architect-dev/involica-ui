import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Text, TokenSymbolImage, SummitButton } from 'uikit'
import { PriceableToken, SummitPalette, TokenSymbol } from 'config/constants'
import { useMintBetaToken } from './useMintBetaToken'

const BTCard = styled(Flex)`
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.text};

  &:first-child {
    margin-top: 0px;
  }
`

const WrapperFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 28px 24px 28px 24px;
  flex-wrap: wrap;
`

const FarmNumericalInfoFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  width: 100%;
`

const SymbolIconFlex = styled(Flex)`
  flex-direction: row;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 200px;
  }
`

interface BetaTokenCardProps {
  token: PriceableToken
  mintAmount: number
}

const BetaTokenCard: React.FC<BetaTokenCardProps> = ({
  token,
  mintAmount,
}) => {
  const {
    symbol,
    decimals,
    tokenAddress,
  } = token

  const { onMint, pending: mintPending } = useMintBetaToken(symbol, tokenAddress, decimals)

  const handleMint = (amount) => {
    if (mintPending) return
    onMint(amount)
  }

  const mintableAmounts = [
    mintAmount / 5,
    mintAmount,
    mintAmount * 5,
  ]

  const addTokenToMetamask = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = window.ethereum
    if (provider) {
        try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await provider.request({
            method: 'wallet_watchAsset',
            params: {
            type: 'ERC20',
            options: {
                address: tokenAddress,
                symbol,
                decimals,
                image: `${window.location.origin}/images/tokens/${symbol}.png`,
            },
            },
        })

        if (wasAdded) {
            console.log('Token was added')
        }
        } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
        }
    }
    }, [tokenAddress, symbol, decimals])

  return (
    <BTCard>
      <WrapperFlex>
        { symbol === TokenSymbol.CAKE && <Text monospace bold italic fontSize='13px' mb='14px' textAlign='center'>* CAKE is used as the fake SUMMIT V1 for the token swap to SUMMIT V2</Text> }
        <FarmNumericalInfoFlex>
          <SymbolIconFlex justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={56} height={56} />
            <Flex flexDirection="column" alignItems="flex-start">
              <Text italic monospace bold fontSize="16px" mb='6px' lineHeight="14px" textAlign="left">
                {symbol}
              </Text>
              <SummitButton
                onClick={addTokenToMetamask}
                height={24}
                padding={16}
                summitPalette={SummitPalette.BASE}
              >
                  + <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
              </SummitButton>
            </Flex>
          </SymbolIconFlex>
          { mintableAmounts.map((mintableAmount) => (
            <SummitButton
              key={mintableAmount}
              onClick={() => handleMint(mintableAmount)}
              width='160px'
              isLoading={mintPending}
            >
              MINT
              <br/>
              {mintableAmount} {symbol}
            </SummitButton>
          ))}
        </FarmNumericalInfoFlex>
      </WrapperFlex>
    </BTCard>
  )
}

export default BetaTokenCard
