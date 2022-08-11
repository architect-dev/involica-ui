import { CHAIN_ID } from './networks'

const bscTestnetLinks: ExternalLinks = {
  etherscan: 'https://testnet.bscscan.com'
}
const ftmLinks: ExternalLinks = {
  etherscan: 'https://ftmscan.com/',
}
const polygonLinks: ExternalLinks = {
  etherscan: 'https://poligonscan.com/'
}

export interface ExternalLinks {
  etherscan: string
}

const chainLinks = {
  56: [],
  97: bscTestnetLinks,
  250: ftmLinks,
  137: polygonLinks,
}

export const getLinks = (): ExternalLinks => {
  return chainLinks[CHAIN_ID]
}

export const getEtherscanName = (): string => {
  return {
    56: 'BscScan',
    97: 'BscTestnetScan',
    250: 'FtmScan',
    137: 'PolygonScan'
  }[CHAIN_ID]
}
