import { useDispatch } from 'react-redux'
import { getExpeditionTreasuryAddress, CHAIN_ID, abi, getSummitTokenAddress, retryableMulticall } from 'utils/'
import { useEffect } from 'react'
import axios from 'axios'
import useRefresh from 'hooks/useRefresh'
import { setExpeditionPot } from 'state/summitEcosystem'
import { BN_ZERO } from 'config/constants'
import BigNumber from 'bignumber.js'

const getChainName = (chain) => {
  if (chain === '250') return 'ftm'
  if (chain === '137') return 'matic'
  return 'ftm'
}

export const useFetchExpeditionPotTotalValue = async () => {
  const expeditionTreasuryAddress = getExpeditionTreasuryAddress()
  const summitTokenAddress = getSummitTokenAddress()
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(
    () => {
      const fetchAndDispatch = async () => {
        const calls = [
          {
            address: summitTokenAddress,
            name: 'balanceOf',
            params: [expeditionTreasuryAddress],
          },
        ]


        const [
          debankRes,
          multicallRes,
        ] = await Promise.all([
          axios.get(`https://openapi.debank.com/v1/user/chain_balance?id=${expeditionTreasuryAddress}&chain_id=${getChainName(CHAIN_ID)}`),
          retryableMulticall(abi.ERC20, calls, 'fetchExpedTreasurySummitBalance')
        ])

        const potTotalValue = debankRes.data.usd_value
        const treasurySummitBalance = multicallRes != null ? new BigNumber(multicallRes[0][0]._hex) : BN_ZERO
        dispatch(setExpeditionPot({
          potTotalValue,
          treasurySummitBalance,
        }))
      }

      fetchAndDispatch()
    },
    [expeditionTreasuryAddress, summitTokenAddress, slowRefresh, dispatch]
  )
}
