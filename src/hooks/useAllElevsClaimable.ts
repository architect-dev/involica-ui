import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { abi, getSubCartographerAddress, groupByAndMap, retryableMulticall } from 'utils/'
import useRefresh from './useRefresh'
import BigNumber from 'bignumber.js'
import { elevationUtils, getFarmConfigs } from 'config/constants'

export const useAllElevsClaimable = () => {
  const [earnedAndVesting, setEarnedAndVesting] = useState<Map<string | number, BigNumber>>(null)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const farmConfigs = getFarmConfigs()

  useEffect(() => {
    const fetchAllElevsClaimable = async () => {
      const calls = elevationUtils.all.map((elevation) => ({
        address: getSubCartographerAddress(elevation),
        name: 'elevClaimableRewards',
        params: [account],
      }))

      const res = await retryableMulticall(abi.cartographerOasis, calls, 'useAllElevsClaimable')
      if (res == null) return

      setEarnedAndVesting(
        groupByAndMap(
          elevationUtils.all,
          (elevation) => elevation,
          (_, index) => new BigNumber(res[index][0]._hex),
        ),
      )
    }

    if (account) {
      fetchAllElevsClaimable()
    }
  }, [account, fastRefresh, farmConfigs])

  return earnedAndVesting
}
