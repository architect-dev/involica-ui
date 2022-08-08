import { abi, getExpeditionAddress, retryableMulticall } from 'utils'
import BigNumber from 'bignumber.js'

export const fetchExpeditionInfo = async () => {
  const calls = [
    {
      address: getExpeditionAddress(),
      name: 'expeditionInfo',
      params: [],
    },
  ]


  const res = await retryableMulticall(abi.expedition, calls, 'fetchExpeditionInfo')
  if (res == null) return null
  const expeditionInfo = res[0]

  return {
    live: expeditionInfo.live,
    launched: expeditionInfo.launched,

    safeEverest: new BigNumber(expeditionInfo.supplies.safe._hex),
    deitiedEverest: new BigNumber(expeditionInfo.supplies.deitied._hex),
    deityEverest: [
      new BigNumber(expeditionInfo.supplies.deity[0]._hex),
      new BigNumber(expeditionInfo.supplies.deity[1]._hex),
    ],

    summit: {
      roundEmission: new BigNumber(expeditionInfo.summit.roundEmission._hex),
      emissionsRemaining: new BigNumber(expeditionInfo.summit.emissionsRemaining._hex),
      markedForDist: new BigNumber(expeditionInfo.summit.markedForDist._hex),
      distributed: new BigNumber(expeditionInfo.summit.distributed._hex),
    },

    usdc: {
      roundEmission: new BigNumber(expeditionInfo.usdc.roundEmission._hex),
      emissionsRemaining: new BigNumber(expeditionInfo.usdc.emissionsRemaining._hex),
      markedForDist: new BigNumber(expeditionInfo.usdc.markedForDist._hex),
      distributed: new BigNumber(expeditionInfo.usdc.distributed._hex),
    },

    roundsRemaining: new BigNumber(expeditionInfo.roundsRemaining._hex).toNumber(),
  }
}
