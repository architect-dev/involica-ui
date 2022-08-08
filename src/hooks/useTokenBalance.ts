import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { abi, getSummitTokenAddress, getTokenBalance, retryableMulticall } from 'utils'
import useRefresh from './useRefresh'

const useSummitTokenBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const bal = await getTokenBalance(summitAddress, account)
      setBalance(bal)
    }

    if (account) {
      fetchBalance()
    }
  }, [account, summitAddress, fastRefresh])

  return balance
}

export const useTotalSummitSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    async function fetchTotalSupply() {
      const res = await retryableMulticall(
        abi.ERC20,
        [
          {
            address: summitAddress,
            name: 'totalSupply',
          },
        ],
        'useTotalSummitSupply',
      )
      if (res == null) return
      const [[supply]] = res
      setTotalSupply(new BigNumber(supply._hex))
    }

    fetchTotalSupply()
  }, [slowRefresh, summitAddress])

  return totalSupply
}

export const useBurnedSummitBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const summitAddress = getSummitTokenAddress()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await retryableMulticall(
        abi.ERC20,
        [
          {
            address: summitAddress,
            name: 'balanceOf',
            params: ['0x000000000000000000000000000000000000dEaD'],
          },
        ],
        'fetchBalance',
      )
      if (res == null) return
      const [[bal]] = res
      setBalance(new BigNumber(bal._hex))
    }

    fetchBalance()
  }, [summitAddress, slowRefresh])

  return balance
}

export default useSummitTokenBalance
