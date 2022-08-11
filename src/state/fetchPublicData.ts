import FetcherABI from 'config/abi/InvolicaFetcher.json'
import { ParseFieldConfig, ParseFieldType, getFetcherAddress } from 'utils'
import multicallAndParse from 'utils/multicall'
import { Token } from './types'

const tokensFields: Record<string, ParseFieldConfig> = {
  tokensData: {
    stateField: 'tokens',
    type: ParseFieldType.nestedArr,
    nestedFields: {
      token: { type: ParseFieldType.address },
      decimals: { type: ParseFieldType.number },
      price: { type: ParseFieldType.bignumber },
    },
  },
}

const fetchPublicData = async (): Promise<Token[]> => {
  const fetcher = getFetcherAddress()
  const calls = [
    {
      address: fetcher,
      name: 'fetchTokensData',
    },
  ]

  const { tokens } = (await multicallAndParse(FetcherABI, calls, tokensFields))[0]

  return tokens.map(
    (token): Token => ({
      ...token,
      symbol: 'TEST',
    }),
  )
}

export default fetchPublicData
