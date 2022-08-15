import { useMemo } from 'react'
import {
  getContract,
  getProviderOrSigner,
  getErc20Contract,
  getInvolicaContract,
  getFetcherContract,
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
  return useMemo(() => address == null ? null : getErc20Contract(address, library.getSigner()), [library, address])
}

export const useInvolica = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getInvolicaContract(library.getSigner()), [library])
}
export const useFetcher = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getFetcherContract(library.getSigner()), [library])
}

export default useContract
