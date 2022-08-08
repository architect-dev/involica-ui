import {
  retryableMulticall,
  abi,
  getExpeditionAddress,
} from 'utils/'
import BigNumber from 'bignumber.js'

export const fetchExpeditionUserData = async (account) => {
  // const account = '0x3da85c9a5303d614764f0b49e7298d11691d0fe1'
  const call = ({
    address: getExpeditionAddress(),
    name: 'userExpeditionInfo',
    params: [account],
  })

  const res = await retryableMulticall(abi.expedition, [call], 'fetchExpeditionUserData')
  if (res == null) return null

  const rawUserData = res[0]

  return {
    everestOwned: new BigNumber(rawUserData.everestOwned._hex),
  
    deity: rawUserData.deitySelected ? rawUserData.deity : null,
    deitySelectionRound: new BigNumber(rawUserData.deitySelectionRound._hex),
    faith: rawUserData.safetyFactorSelected ? (100 - rawUserData.safetyFactor) : null,
  
    entered: rawUserData.entered,
  
    summitLifetimeWinnings: new BigNumber(rawUserData.summit.lifetimeWinnings._hex),
    usdcLifetimeWinnings: new BigNumber(rawUserData.usdc.lifetimeWinnings._hex),
  }
}

export const fetchExpeditionWinnings = async (account) => {
  // const account = '0x3da85c9a5303d614764f0b49e7298d11691d0fe1'
  const call = {
    address: getExpeditionAddress(),
    name: 'rewards',
    params: [account],
  }

  const res = await retryableMulticall(abi.expedition, [call], 'fetchExpeditionWinnings')

  if (res == null) return {
    summitWinnings: new BigNumber(0),
    usdcWinnings: new BigNumber(0),
  }

  return {
    summitWinnings: new BigNumber(res[0][0]._hex),
    usdcWinnings: new BigNumber(res[0][1]._hex),
  }
}
