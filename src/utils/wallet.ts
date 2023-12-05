// Set of helper functions to facilitate wallet setup

import { getLinks } from '@config/constants'
import { nodes } from './getRpcUrl'
import { CHAIN_ID } from '../config/constants/networks'
import { getTokenImage } from './tokenImage'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const provider = window.ethereum
	if (provider) {
		const existingChainId = parseInt(provider.networkVersion)
		const targetChainId = parseInt(CHAIN_ID, 10)
		if (targetChainId !== existingChainId) {
			try {
				await provider.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: `0x${targetChainId.toString(16)}` }],
				})
			} catch (err: any) {
				if (err.code === 4902) {
					try {
						await provider.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: `0x${targetChainId.toString(16)}`,
									chainName: 'Binance Smart Chain Mainnet',
									nativeCurrency: {
										name: 'BNB',
										symbol: 'bnb',
										decimals: 18,
									},
									rpcUrls: nodes,
									blockExplorerUrls: [`${getLinks().etherscan}/`],
								},
							],
						})
						return true
					} catch (error) {
						console.error('Failed to setup the network in Metamask:', error)
						return false
					}
				}
			}
		}
		return true
	}

	console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
	return false
}

export const registerToken = async (tokenAddress: string, displaySymbol: string, assetSymbol: string, tokenDecimals: number) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const tokenAdded = await window.ethereum.request({
		method: 'wallet_watchAsset',
		params: {
			type: 'ERC20',
			options: {
				address: tokenAddress,
				symbol: displaySymbol.slice(0, 11),
				decimals: tokenDecimals,
				image: await getTokenImage(displaySymbol),
			},
		},
	})

	return tokenAdded
}
