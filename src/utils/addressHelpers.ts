import addresses from 'config/constants/contracts.json'
import { CHAIN_ID } from '../config/constants/networks'

export const getInvolicaAddress = () => {
  return addresses.involica[CHAIN_ID]
}
export const getFetcherAddress = () => {
  return addresses.fetcher[CHAIN_ID]
}
export const getMulticallAddress = () => {
  return addresses.multicall[CHAIN_ID]
}
