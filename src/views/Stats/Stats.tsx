import React from 'react'
import styled from 'styled-components'
import { HighlightedText } from 'uikit'
import Page from 'components/layout/Page'
import { useQuery } from '@apollo/client'
import { BLOCK_PRICES, DAY_TOKEN_DATA } from 'config/constants/graph'
import { useInvolicaUserStatsData, useDailyTokenPrices, useInvolicaDCAChartData } from 'state/uiHooks'

const Hero = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
`

const StyledHighlightedText = styled(HighlightedText)<{
  fontSize: string
  letterSpacing: string
}>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 200;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

export const tokens = {
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': 'FTM',
  '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': 'USDC',
  '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': 'DAI',
  '0x049d68029688eAbF473097a2fC38ef61633A3C7A': 'fUSDT',
  '0x82f0B8B456c1A451378467398982d4834b6829c1': 'MIM',
  '0x321162Cd933E2Be498Cd2267a90534A804051b11': 'BTC',
  '0x74b23882a30290451A17c44f4F05243b6b58C76d': 'ETH',
  '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': 'wFTM',
  '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454': 'BNB',
  '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3': 'MATIC',
  '0x511D35c52a3C244E7b8bd92c0C297755FbD89212': 'AVAX',
  '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE': 'BOO',
  '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': 'LINK',
  '0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475': 'SCREAM',
  '0x1E4F97b9f9F913c46F1632781732927B9019C68b': 'CRV',
  '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC': 'SUSHI',
  '0x29b0Da86e484E1C0029B56e817912d778aC0EC69': 'YFI',
  '0xd6070ae98b8069de6B494332d1A1a81B6179D960': 'BIFI',
  '0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9': 'LQDR',
  '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B': 'AAVE',
}

const Stats: React.FC = () => {
  // const userInteractingTokens = useUserInteractingTokens()
  // const { loading, error, data } = useQuery(DAY_TOKEN_DATA, {
  //   variables: { tokens: Object.keys(tokens), timestamp: 1663674332 }
  // })
  // console.log({
  //   loading,
  //   error,
  //   data
  // })
  // useDailyTokenPrices()
  // useInvolicaUserStatsData()
  useInvolicaDCAChartData(null)
  return (
    <Page>
      <Hero>
        <StyledHighlightedText
          className="sticky"
          fontSize="34px"
          letterSpacing="16px"
        >
          INVOLICA
        </StyledHighlightedText>
      </Hero>
    </Page>
  )
}

export default Stats
