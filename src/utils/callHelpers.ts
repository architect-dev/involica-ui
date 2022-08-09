import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { callWithEstimateGas } from './estimateGas'

export const approve = async (tokenContract, targetAddress, amount) => {
  return callWithEstimateGas(
    tokenContract,
    'approve',
    [targetAddress, amount]
  )
}

export const depositTreasury = async (involica, amount) => {
  return callWithEstimateGas(
    involica,
    'depositTreasury',
    [],
    { value: amount }
  )
}

export const withdrawTreasury = async (involica, amount) => {
  return callWithEstimateGas(
    involica,
    'withdrawTreasury',
    [amount]
  )
}

export const setPosition = async (involica, position) => {
  return callWithEstimateGas(
    involica,
    'setPosition',
    [position.tokenIn, position.outs, position.amountDCA, position.intervalDCA, position.maxGasPrice]
  )
}

export const reInitPosition = async (involica) => {
  return callWithEstimateGas(
    involica,
    'reInitPosition',
    []
  )
}

export const exitPosition = async (involica) => {
  return callWithEstimateGas(
    involica,
    'exitPosition',
    []
  )
}

export const manualExecuteDCA = async (involica, account, swapsAmountOutMin) => {
  return callWithEstimateGas(
    involica,
    'executeDCA',
    [account, swapsAmountOutMin]
  )
}


// WRAPPER TO RETRY TRANSACTIONS
export const retryDecorator = (decoratee, retryCount = 4) => {
  return (...args) => {
    return new Promise((fulfill) => {
      const reasons = []

      const makeCall = () => {
        decoratee(...args).then(fulfill, (reason) => {
          const retry = reasons.length < retryCount
          reasons.push(reason)
          if (retry) makeCall()
          else fulfill({ err: reasons })
        })
      }

      makeCall()
    })
  }
}
