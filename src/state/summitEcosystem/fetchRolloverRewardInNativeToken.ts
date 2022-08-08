import BigNumber from 'bignumber.js'
import { abi, getCartographerAddress, retryableMulticall } from 'utils'

export const fetchRolloverReward = async () => {
  const res = await retryableMulticall(
    abi.cartographer,
    [
      {
        address: getCartographerAddress(),
        name: 'rolloverReward',
      },
    ],
    'fetchRelloverReward',
  )
  if (res == null) return null
  const [rolloverRewardInNativeToken] = res
  return new BigNumber(rolloverRewardInNativeToken)
}
