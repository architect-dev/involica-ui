import FetcherABI from 'config/abi/InvolicaFetcher.json'
import { ParseFieldConfig, ParseFieldType, getFetcherAddress, groupByAndMap } from 'utils'
import multicallAndParse from 'utils/multicall'
import { UserData, UserTokenData } from './types'

const userDataFields: Record<string, ParseFieldConfig> = {
  userHasPosition: { type: ParseFieldType.bool },
  userTreasury: { type: ParseFieldType.bignumber },
  position: {
    type: ParseFieldType.nested,
    nestedFields: {
      user: { type: ParseFieldType.address },
      tokenIn: { type: ParseFieldType.address },
      outs: {
        type: ParseFieldType.nestedArr,
        nestedFields: {
          token: { type: ParseFieldType.address },
          weight: { type: ParseFieldType.numberBp },
          maxSlippage: { type: ParseFieldType.bignumber },
        },
      },
      amountDCA: { type: ParseFieldType.bignumber },
      intervalDCA: { type: ParseFieldType.number },
      lastDCA: { type: ParseFieldType.number },
      maxGasPrice: { type: ParseFieldType.numberBp },
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
      token: { type: ParseFieldType.address, stateField: 'address' },
      allowance: { type: ParseFieldType.bignumber },
      balance: { type: ParseFieldType.bignumber },
    }
  },
  swapsAmountOutMin: { type: ParseFieldType.bignumberArr },
}

const fetchUserData = async (account): Promise<UserData | null> => {
  const fetcher = getFetcherAddress()
  const calls = [
    {
      address: fetcher,
      name: 'fetchUserData',
      params: [account],
    },
  ]

  const res = await multicallAndParse(FetcherABI, calls, userDataFields)
  if (res == null) return null

  const userData = res[0]

  console.log({
    userData
  })

  return {
    ...userData,
    userTokensData: groupByAndMap(
      userData.userTokensData.slice(0, -1),
      (token: UserTokenData) => token.address,
      (token: UserTokenData) => token
    ),
    userNativeTokenData: userData.userTokensData[userData.userTokensData.length - 1]
  }
}

export default fetchUserData
