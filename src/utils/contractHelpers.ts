import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import InvolicaABI from '../config/abi/Involica.json'
import FetcherABI from '../config/abi/InvolicaFetcher.json'
import ERC20ABI from '../config/abi/ERC20.json'
import MulticallABI from '../config/abi/Multicall.json'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from '@utils/providers'
import { getFetcherAddress, getInvolicaAddress, getMulticallAddress } from './addressHelpers'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { Nullable } from './types'

type SignerLike = Signer | Provider | JsonRpcSigner

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
	return library.getSigner(account).connectUnchecked()
}

// account is optional
export const getProviderOrSigner = (library: Web3Provider, account?: Nullable<string>) => {
	return account ? getSigner(library, account) : library
}

export const getContract = (abi: any, address: string, signer?: SignerLike) => {
	const signerOrProvider: any = signer ?? simpleRpcProvider
	return new Contract(address, abi, signerOrProvider)
}

export const getErc20Contract = (address: string, signer?: SignerLike) => {
	return getContract(ERC20ABI, address, signer)
}

export const getInvolicaContract = (signer?: SignerLike) => {
	return getContract(InvolicaABI, getInvolicaAddress(), signer)
}

export const getFetcherContract = (signer?: SignerLike) => {
	return getContract(FetcherABI, getFetcherAddress(), signer)
}

export const getMulticallContract = (signer?: SignerLike) => {
	return getContract(MulticallABI, getMulticallAddress(), signer)
}
