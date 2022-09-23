import FetcherABI from 'config/abi/InvolicaFetcher.json'
import InvolicaABI from 'config/abi/Involica.json'
import { getDecimals } from 'config/tokens'
import {
  ParseFieldConfig,
  ParseFieldType,
  getFetcherAddress,
  groupByAndMap,
  decOffset,
  getInvolicaAddress,
} from 'utils'
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
          maxSlippage: { type: ParseFieldType.numberBp },
        },
      },
      amountDCA: { type: ParseFieldType.bignumber },
      intervalDCA: { type: ParseFieldType.number },
      lastDCA: { type: ParseFieldType.number },
      maxGasPrice: { type: ParseFieldType.gwei },
      taskId: { type: ParseFieldType.string },
      paused: { type: ParseFieldType.bool },
      manualExecutionOnly: { type: ParseFieldType.bool },
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
    },
  },
  swapsAmountOutMin: { type: ParseFieldType.bignumberArr },
}

const userTxsFields: Record<string, ParseFieldConfig> = {
  '0': {
    type: ParseFieldType.nestedArr,
    stateField: 'userTxs',
    nestedFields: {
      timestamp: { type: ParseFieldType.number },
      tokenIn: { type: ParseFieldType.address },
      txFee: { type: ParseFieldType.bignumber },
      tokenTxs: {
        type: ParseFieldType.nestedArr,
        nestedFields: {
          tokenIn: { type: ParseFieldType.address },
          tokenInPrice: { type: ParseFieldType.numberPrice },
          tokenOut: { type: ParseFieldType.address },
          amountIn: { type: ParseFieldType.bignumber },
          amountOut: { type: ParseFieldType.bignumber },
          err: { type: ParseFieldType.string },
        },
      },
    },
  },
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
  const involica = getInvolicaAddress()
  const userTxsCalls = [
    {
      address: involica,
      name: 'fetchUserTxs',
      params: [account],
    },
  ]

  const [res, userTxsRes] = await Promise.all([
    multicallAndParse(FetcherABI, calls, userDataFields),
    multicallAndParse(InvolicaABI, userTxsCalls, userTxsFields),
  ])
  if (res == null) return null

  const userData = res[0]

  // Offset amountDCA decimals
  userData.position.amountDCA = decOffset(
    userData.position.amountDCA,
    getDecimals(userData.position.tokenIn),
  ).toString()

  const { userTxs } = userTxsRes[0] || { userTxs: [] }

  return {
    ...userData,
    userTokensData: groupByAndMap(
      userData.userTokensData.slice(0, -1),
      (token: UserTokenData) => token.address,
      (token: UserTokenData) => token,
    ),
    userNativeTokenData: userData.userTokensData[userData.userTokensData.length - 1],
    userTxs: userTxs.reverse(),
  }
}

export default fetchUserData
