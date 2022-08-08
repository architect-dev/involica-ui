import BigNumber from 'bignumber.js'
import { abiItem } from './abi'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from 'utils/providers'
import { getCartographerAddress, getElevationHelperAddress, getEverestTokenAddress, getExpeditionAddress, getMulticallAddress, getSummitGlacierAddress, getSummitTokenAddress, getSummitTrustedSeederModuleAddress } from './addressHelpers'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BN_ZERO } from 'config/constants'

type SignerLike = Signer | Provider | JsonRpcSigner


// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export const getProviderOrSigner = (library: Web3Provider, account?: string) => {
  return account ? getSigner(library, account) : library
}

export const getContract = (abi: any, address: string, signer?: SignerLike) => {
  const signerOrProvider: any = signer ?? simpleRpcProvider
  return new Contract(address, abi, signerOrProvider)
}

export const getErc20Contract = (address: string, signer?: SignerLike) => {
  return getContract(abiItem.ERC20, address, signer)
}

export const getSummitTokenContract = (signer?: SignerLike) => {
  return getContract(abiItem.summitToken, getSummitTokenAddress(), signer)
}

export const getEverestTokenContract = (signer?: SignerLike) => {
  return getContract(abiItem.everestToken, getEverestTokenAddress(), signer)
}

export const getCartographerContract = (signer?: SignerLike) => {
  return getContract(abiItem.cartographer, getCartographerAddress(), signer)
}

export const getExpeditionContract = (signer?: SignerLike) => {
  return getContract(abiItem.expedition, getExpeditionAddress(), signer)
}

export const getElevationHelperContract = (signer?: SignerLike) => {
  return getContract(abiItem.elevationHelper, getElevationHelperAddress(), signer)
}

export const getSummitTrustedSeederModuleContract = (signer?: SignerLike) => {
  return getContract(abiItem.summitTrustedSeederModule, getSummitTrustedSeederModuleAddress(), signer)
}

export const getSummitGlacierContract = (signer?: SignerLike) => {
  return getContract(abiItem.summitGlacier, getSummitGlacierAddress(), signer)
}

export const getDummyTokenContract = (address: string, signer?: SignerLike) => {
  return getContract(abiItem.DummyERC20, address, signer)
}

export const getMulticallContract = () => {
  return getContract(abiItem.multicall, getMulticallAddress(), simpleRpcProvider)
}

export const getTokenBalance = async (
  tokenAddress: string,
  userAddress: string,
): Promise<BigNumber> => {
  const contract = getErc20Contract(tokenAddress)
  try {
    const balance = await contract.balanceOf(userAddress)
    return new BigNumber(balance._hex)
  } catch (e) {
    return BN_ZERO
  }
}

export const getTokenApproved = async (
  tokenAddress: string,
  userAddress: string,
  targetAddress: string,
): Promise<boolean> => {
  const contract = getErc20Contract(tokenAddress)
  try {
    const allowance: BigNumber = await contract.allowance(userAddress, targetAddress)
    return allowance.gt(0)
  } catch (e) {
    return false
  }
}
