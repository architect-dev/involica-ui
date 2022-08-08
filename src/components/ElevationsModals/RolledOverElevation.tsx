import React from 'react'
import { Elevation } from 'config/constants/types'
import styled from 'styled-components'
import { HighlightedText, Flex } from 'uikit'
import ArtworkTotem from 'uikit/components/Totem/ArtworkTotem'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber } from 'utils'
import BigNumber from 'bignumber.js'

interface Props {
  elevation: Elevation
  totem: number
  summitWinnings: BigNumber
  usdcWinnings: BigNumber
  multiWin: boolean
}

const TotemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  animation: entry 0.3s ease-out;
  @keyframes entry {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    to {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  &:before {
    content: ' ';
    width: 700px;
    height: 700px;
    position: absolute;
    margin: auto;
    border-radius: 350px;
    background-color: gold;
    opacity: 0;

    animation: popEntry 0.6s ease-out;
    @keyframes popEntry {
      0% {
        opacity: 0.8;
        -webkit-transform: scale(0);
        transform: scale(0);
      }
      to {
        opacity: 0;
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }
  }
`

export const RolledOverElevation: React.FC<Props> = ({ elevation, totem, summitWinnings, usdcWinnings, multiWin }) => {
  const rawSummitWinnings = getBalanceNumber(summitWinnings)
  const rawUsdcWinnings = getBalanceNumber(usdcWinnings, 6)

  return (
    <TotemWrapper key={elevation}>
      {multiWin && (
        <HighlightedText summitPalette={elevation} header fontSize="18">
          THE {elevation}:
        </HighlightedText>
      )}

      <HighlightedText summitPalette={Elevation.EXPEDITION} header fontSize="14" gold>
        MULTI-ROUND
        <br/>
        WINNINGS:
      </HighlightedText>
      <CardValue
        value={rawSummitWinnings}
        decimals={3}
        postfix='SUMMIT'
        summitPalette={Elevation.EXPEDITION}
        fontSize="28"
        postfixFontSize="20"
        gold
      />
      { usdcWinnings.isGreaterThan(0) ?
        <Flex mt='-12px' mb='-12px'>
          <CardValue
            value={rawUsdcWinnings}
            decimals={2}
            postfix='USDC'
            summitPalette={Elevation.EXPEDITION}
            fontSize="28"
            postfixFontSize="20"
            gold
          />
        </Flex> :
        <>
          <br/>
          <br/>
          <br/>
        </>
      }
      <ArtworkTotem
        elevation={elevation}
        totem={totem}
        desktopSize="200"
        mobileSize={multiWin ? '120' : '200'}
      />
    </TotemWrapper>
  )
}
