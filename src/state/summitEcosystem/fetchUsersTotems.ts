import { retryableMulticall, abi, getSubCartographerAddress, getExpeditionAddress } from 'utils/'
import { Elevation, elevationUtils } from 'config/constants/types'
import BigNumber from 'bignumber.js'

export const fetchUsersTotems = async (account) => {
  // const account = '0x1075d36082FaE788864637D082b86253c61a271E'

  const elevCalls = elevationUtils.elevationOnly.map((elevation) => ({
    address: getSubCartographerAddress(elevation),
    name: 'userElevationInfo',
    params: [account],
  }))

  const expedCalls = [{
    address: getExpeditionAddress(),
    name: 'userExpeditionInfo',
    params: [account],
  }]

  const [elevRes, expedRes] = await Promise.all([
    retryableMulticall(abi.cartographerElevation, elevCalls, 'fetchUserElevationInfo'),
    retryableMulticall(abi.expedition, expedCalls, 'fetchExpeditionInfo')
  ])
  if (elevRes == null) return null

  const usersTotems = {
    [Elevation.OASIS]: {
      totem: 0,
      totemSelectionRound: 0,
    },
    [Elevation.EXPEDITION]: expedRes == null ? {
        totem: null,
        totemSelectionRound: null,
      } :
      {
        totem: expedRes[0].deitySelected ? expedRes[0].deity : null,
        totemSelectionRound: new BigNumber(expedRes[0].deitySelectionRound._hex).toNumber(),
      }
  }

  elevationUtils.elevationOnly.forEach((elevation, index) => {
    const { totemSelected, totem, totemSelectionRound } = elevRes[index]
    usersTotems[elevation] = {
      totem: totemSelected ? totem : null,
      totemSelectionRound: new BigNumber(totemSelectionRound._hex).toNumber(),
    }
  })

  return usersTotems
}
