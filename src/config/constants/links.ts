import { CHAIN_ID } from './networks'

const bscTestnetLinks: ExternalLinks = {
	etherscan: 'https://testnet.bscscan.com',
}
const ftmLinks: ExternalLinks = {
	etherscan: 'https://ftmscan.com/',
}
const polygonLinks: ExternalLinks = {
	etherscan: 'https://poligonscan.com/',
}

export interface ExternalLinks {
	etherscan: string
}

const chainLinks: Record<string, ExternalLinks> = {
	56: ftmLinks, // TODO: Update this to correct values
	97: bscTestnetLinks,
	250: ftmLinks,
	137: polygonLinks,
}

export const getLinks = (): ExternalLinks => {
	return chainLinks[CHAIN_ID]
}
