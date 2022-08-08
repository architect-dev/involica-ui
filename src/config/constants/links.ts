import { bscTestnetLinks } from './chain/bsc_testnet/links'
import { ftmLinks } from './chain/ftm/links'
import { polygonLinks } from './chain/polygon/links'
import { CHAIN_ID } from './networks'

export interface ExternalLinks {
  exchange: string
  liquidity: string
  summitTokenLink: string
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
