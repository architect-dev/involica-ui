import { useMemo } from 'react'
import {
  getContract,
  getProviderOrSigner,
  getCartographerContract,
  getExpeditionContract,
  getErc20Contract,
  getSummitGlacierContract,
  getEverestTokenContract,
  getSummitTokenContract,
  getV1SummitTokenAddress,
} from 'utils/'
import useActiveWeb3React from './useActiveWeb3React'

const useContract = (ABI: any, address: string | undefined, withSignerIfPossible = true) => {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, withSignerIfPossible ? getProviderOrSigner(library, account) as any : null)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getErc20Contract(address, library.getSigner()), [library, address])
}



export const useV1SummitToken = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getErc20Contract(getV1SummitTokenAddress(), library.getSigner()), [library])
}

export const useSummitToken = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSummitTokenContract(library.getSigner()), [library])
}
export const useEverestToken = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getEverestTokenContract(library.getSigner()), [library])
}

export const useCartographer = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getCartographerContract(library.getSigner()), [library])
}
export const useExpedition = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getExpeditionContract(library.getSigner()), [library])
}
export const useElevationHelper = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSummitGlacierContract(library.getSigner()), [library])
}
export const useSummitGlacier = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSummitGlacierContract(library.getSigner()), [library])
}

export default useContract
