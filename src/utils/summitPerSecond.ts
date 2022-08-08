import { useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'
import { retryableMulticall } from './multicall'
import { getCartographerAddress } from './addressHelpers'
import { abi } from './abi'
import BigNumber from 'bignumber.js'

export const useSummitPerSecond = () => {
  const [summitPerSecond, setSummitPerSecond] = useState(new BigNumber(0))
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    async function fetchSummitPerSecond() {
      const res = await retryableMulticall(
        abi.cartographer,
        [
          {
            address: getCartographerAddress(),
            name: 'summitPerSecond',
          },
        ],
        'useSummitPerSecond',
      )
      if (res == null) return
      setSummitPerSecond(new BigNumber(res[0]))
    }
    fetchSummitPerSecond()
  }, [fastRefresh])

  return summitPerSecond
}
