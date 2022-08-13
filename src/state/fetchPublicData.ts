import FetcherABI from 'config/abi/InvolicaFetcher.json'
import { getSymbol } from 'config/symbols'
import { ParseFieldConfig, ParseFieldType, getFetcherAddress, groupBy } from 'utils'
import multicallAndParse from 'utils/multicall'
import { AddressRecord, Token } from './types'

const tokensFields: Record<string, ParseFieldConfig> = {
  tokensData: {
    stateField: 'tokens',
    type: ParseFieldType.nestedArr,
    nestedFields: {
      token: { type: ParseFieldType.address, stateField: 'address' },
      decimals: { type: ParseFieldType.number },
      price: { type: ParseFieldType.number },
    },
  },
}

const fetchPublicData = async (): Promise<{
  tokens: AddressRecord<Token>,
  nativeToken: Token,
}> => {
  const fetcher = getFetcherAddress()
  const calls = [
    {
      address: fetcher,
      name: 'fetchTokensData',
    },
  ]

  const { tokens } = (await multicallAndParse(FetcherABI, calls, tokensFields))[0]
  const popTokens = tokens.map((token: Token) => ({ ...token, symbol: getSymbol(token.address), price: token.price / 1e6 }))
  const nonNatives = popTokens.slice(0, -1)
  const nativeToken = popTokens[popTokens.length - 1]

  return {
    tokens: groupBy(
      nonNatives,
      (token: Token) => token.address
    ),
    nativeToken
  }
}

export default fetchPublicData
