// Set of helper functions to facilitate wallet setup

import { TokensWithCustomArtwork } from 'config/constants'
import mergeImages from 'merge-images-v2'

export const getSymbolParts = (symbol) => {
    const symbolPartsRaw = symbol.split('-')
    return symbolPartsRaw.sort((a, b) => (symbolSortPrio(a) > symbolSortPrio(b) ? 1 : -1))
}

export const symbolSortPrio = (symbol): number => {
    switch (symbol) {
        case 'SUMMIT':
        case 'BSHARE':
        case 'BASED':
        case 'xBOO':
        case 'MIM':
            return 1
        case 'FTM':
            return -1
        default:
            return 0
    }
  }

export const getTokenImage = (symbol) => {
    if (TokensWithCustomArtwork[symbol]) {
        const b64 = mergeImages([
            {src: `${window.location.origin}/images/tokens/${symbol}.png`, x: 16, y: 16, width: 96, height: 96},
        ], { width: 128, height: 128 })
        return b64
    }
    const symbolParts = getSymbolParts(symbol)
    if (symbolParts.length === 1) return `${window.location.origin}/images/tokens/${symbol}.png`
    const symbolPartUrls = symbolParts.map((part) => `${window.location.origin}/images/tokens/${part}.png`)
    const b64 = mergeImages([
        {src: symbolPartUrls[0], x: 0, y: 22, width: 84, height: 84},
        {src: symbolPartUrls[1], x: 44, y: 22, width: 84, height: 84},
    ], { width: 128, height: 128 })
    return b64
}
