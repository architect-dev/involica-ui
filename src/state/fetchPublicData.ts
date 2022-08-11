import FetcherABI from 'config/abi/InvolicaFetcher.json'
import { ParseFieldConfig, ParseFieldType, getFetcherAddress } from 'utils'
import multicallAndParse from 'utils/multicall'
import { Token } from './types'

const tokensFields: Record<string, ParseFieldConfig> = {
  tokens: { type: ParseFieldType.addressArr },
  prices: { type: ParseFieldType.bignumberArr },
}

const fetchPublicData = async (): Promise<Token[]> => {
  const fetcher = getFetcherAddress()
  const calls = [
    {
      address: fetcher,
      name: 'fetchTokensData',
    },
  ]

  return multicallAndParse(FetcherABI, calls, tokensFields)
}

export default fetchPublicData
