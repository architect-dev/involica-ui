import addresses from 'config/constants/contracts'
import { Elevation } from 'config/constants/types'
import { CHAIN_ID } from '../config/constants/networks'

export const getSummitTokenAddress = () => {
  return addresses.summitToken[CHAIN_ID]
}
export const getV1SummitTokenAddress = () => {
  return addresses.oldSummitToken[CHAIN_ID]
}
export const getEverestTokenAddress = () => {
  return addresses.everestToken[CHAIN_ID]
}
export const getSummitLpAddress = () => {
  return addresses.summitLpToken[CHAIN_ID]
}
export const getCartographerAddress = () => {
  return addresses.cartographer[CHAIN_ID]
}
export const getCartographerOasisAddress = () => {
  return addresses.cartographerOasis[CHAIN_ID]
}
export const getCartographerPlainsAddress = () => {
  return addresses.cartographerPlains[CHAIN_ID]
}
export const getCartographerMesaAddress = () => {
  return addresses.cartographerMesa[CHAIN_ID]
}
export const getCartographerSummitAddress = () => {
  return addresses.cartographerSummit[CHAIN_ID]
}
export const getSubCartographerAddress = (elevation: Elevation) => {
  switch (elevation) {
    case Elevation.OASIS: return addresses.cartographerOasis[CHAIN_ID]
    case Elevation.PLAINS: return addresses.cartographerPlains[CHAIN_ID]
    case Elevation.MESA: return addresses.cartographerMesa[CHAIN_ID]
    case Elevation.SUMMIT: return addresses.cartographerSummit[CHAIN_ID]
    default: return ''
  }
}
export const getExpeditionAddress = () => {
  return addresses.expedition[CHAIN_ID]
}
export const getElevationHelperAddress = () => {
  return addresses.elevationHelper[CHAIN_ID]
}
export const getSummitTrustedSeederModuleAddress = () => {
  return addresses.summitTrustedSeederModule[CHAIN_ID]
}
export const getSummitGlacierAddress = () => {
  return addresses.summitGlacier[CHAIN_ID]
}
export const getMulticallAddress = () => {
  return addresses.multicall[CHAIN_ID]
}
export const getAmmFactoryAddress = () => {
  return addresses.ammFactory[CHAIN_ID]
}
export const getAmmRouterAddress = () => {
  return addresses.ammRouter[CHAIN_ID]
}
export const getWrappedNativeTokenAddress = () => {
  return addresses.wrappedNativeToken[CHAIN_ID]
}
export const getPeggedTokenAddress = () => {
  return addresses.peggedToken[CHAIN_ID]
}
export const getNativePeggedLpAddress = () => {
  return addresses.nativePeggedLp[CHAIN_ID]
}
export const getExpeditionTreasuryAddress = () => {
  return addresses.expeditionTreasury[CHAIN_ID]
}
export const getBalancer2PoolPriceOracleAddress = () => {
  return addresses.beethoven2PoolOracle[CHAIN_ID]
}
export const getBalancerMultiPoolPriceOracleAddress = () => {
  return addresses.beethovenMultiPoolOracle[CHAIN_ID]
}
