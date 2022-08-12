import FetcherABI from 'config/abi/InvolicaFetcher.json'
import { ParseFieldConfig, ParseFieldType, getFetcherAddress, groupByAndMap } from 'utils'
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

const fetchPublicData = async (): Promise<AddressRecord<Token>> => {
  const fetcher = getFetcherAddress()
  const calls = [
    {
      address: fetcher,
      name: 'fetchTokensData',
    },
  ]

  const { tokens } = (await multicallAndParse(FetcherABI, calls, tokensFields))[0]

  return groupByAndMap(
    tokens,
    (token: Token) => token.address,
    (token: Token) => ({ ...token, symbol: 'TEST', price: token.price / 1e6 }),
  )
}

export default fetchPublicData
