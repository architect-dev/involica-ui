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
    return `${window.location.origin}/images/tokens/${symbol}.png`
}
