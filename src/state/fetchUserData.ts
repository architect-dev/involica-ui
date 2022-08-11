import FetcherABI from 'config/abi/InvolicaFetcher.json'
import { ParseFieldConfig, ParseFieldType, getFetcherAddress } from 'utils'
import multicallAndParse from 'utils/multicall'
import { UserData } from './types'

const userDataFields: Record<string, ParseFieldConfig> = {
  userHasPosition: { type: ParseFieldType.bool },
  userTreasury: { type: ParseFieldType.bignumber },
  position: {
    type: ParseFieldType.nested,
    nestedFields: {
      user: { type: ParseFieldType.address },
      tokenIn: { type: ParseFieldType.address },
      outs: {
        type: ParseFieldType.nested,
        nestedFields: {
          token: { type: ParseFieldType.address },
          weight: { type: ParseFieldType.number },
          route: { type: ParseFieldType.addressArr },
          maxSlippage: { type: ParseFieldType.bignumber },
        },
      },
      amountDCA: { type: ParseFieldType.bignumber },
      intervalDCA: { type: ParseFieldType.number },
      lastDCA: { type: ParseFieldType.number },
      maxGasPrice: { type: ParseFieldType.number },
      taskId: { type: ParseFieldType.string },
      finalizationReason: { type: ParseFieldType.string },
    },
  },
  allowance: { type: ParseFieldType.bignumber },
  balance: { type: ParseFieldType.bignumber },
  dcasRemaining: { type: ParseFieldType.number },
  userTokensData: {
    type: ParseFieldType.nestedArr,
    nestedFields: {
      token: { type: ParseFieldType.address },
      allowance: { type: ParseFieldType.bignumber },
      balance: { type: ParseFieldType.bignumber },
    }
  },
  swapsAmountOutMin: { type: ParseFieldType.bignumberArr },
}

const fetchUserData = async (account): Promise<UserData> => {
  const fetcher = getFetcherAddress()
  const calls = [
    {
      address: fetcher,
      name: 'fetchUserData',
      params: [account],
    },
  ]

  return multicallAndParse(FetcherABI, calls, userDataFields)
}

export default fetchUserData
