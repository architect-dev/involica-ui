import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { ethers } from 'ethers'
import { callWithEstimateGas } from './estimateGas'

export const approve = async (tokenContract, targetAddress) => {
  return callWithEstimateGas(
    tokenContract,
    'approve',
    [targetAddress, ethers.constants.MaxUint256]
  )
}

export const betaTokenMint = async (tokenContract, amount, account, decimals) => {
  return callWithEstimateGas(
    tokenContract,
    'mint',
    [account, new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()]
  )
}

export const stake = async (cartographer, token, elevation, amount, account, decimals) => {
  return callWithEstimateGas(
    cartographer,
    'deposit',
    [
      token,
      elevationUtils.toInt(elevation),
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
    ]
  )
}

export const withdraw = async (cartographer, token, elevation, amount, decimals) => {
  return callWithEstimateGas(
    cartographer,
    'withdraw',
    [
      token,
      elevationUtils.toInt(elevation),
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
    ]
  )
}

export const claimPool = async (cartographer, token, elevation) => {
  return callWithEstimateGas(
    cartographer,
    'deposit',
    [token, elevationUtils.toInt(elevation), '0']
  )
}

export const claimElevation = async (cartographer, elevation) => {
  return callWithEstimateGas(
    cartographer,
    'claimElevation',
    [elevationUtils.toInt(elevation)]
  )
}

export const selectTotemAndOrFaith = async (cartographer, expedition, elevation, totem, faith) => {
  const isExpedition = elevation === Elevation.EXPEDITION

  if (isExpedition) {
    if (totem != null && faith != null) {
      return callWithEstimateGas(
        expedition,
        'selectDeityAndSafetyFactor',
        [totem, 100 - faith]
      )
    }
    if (totem != null) {
      return callWithEstimateGas(
        expedition,
        'selectDeity',
        [totem]
      )
    }
    if (faith != null) {
      return callWithEstimateGas(
        expedition,
        'selectSafetyFactor',
        [100 - faith]
      )
    }
  }

  return callWithEstimateGas(
    cartographer,
    'switchTotem',
    [elevationUtils.toInt(elevation), totem]
  )
}

export const enterExpedition = async (expedition) => {
  return callWithEstimateGas(
    expedition,
    'joinExpedition'
  )
}
export const harvestExpedition = async (expedition) => {
  return callWithEstimateGas(
    expedition,
    'harvestExpedition'
  )
}

export const elevate = async (cartographer, token, sourceElevation, targetElevation, amount, decimals) => {
  return callWithEstimateGas(
    cartographer,
    'elevate',
    [
      token,
      elevationUtils.toInt(sourceElevation),
      elevationUtils.toInt(targetElevation),
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()
    ]
  )
}

// V1 --> V2 Token swap
export const tokenSwapV1Summit = async (summitToken, v1SummitBalance) => {
  return callWithEstimateGas(
    summitToken,
    'tokenSwap',
    [new BigNumber(v1SummitBalance).times(new BigNumber(10).pow(18)).toString()]
  )
}

// EPOCH
export const harvestEpoch = async (summitGlacier, epochIndex, amount, lockForEverest) => {
  return callWithEstimateGas(
    summitGlacier,
    'harvestWinnings',
    [
      epochIndex,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      lockForEverest
    ]
  )
}

// EVEREST LOCKING
export const lockSummit = async (everestToken, amount, duration) => {
  return callWithEstimateGas(
    everestToken,
    'lockSummit',
    [
      amount,
      duration
    ]
  )
}
export const increaseLockedSummit = async (everestToken, amount) => {
  return callWithEstimateGas(
    everestToken,
    'increaseLockedSummit',
    [amount]
  )
}
export const increaseLockDuration = async (everestToken, duration) => {
  return callWithEstimateGas(
    everestToken,
    'increaseLockDuration',
    [duration]
  )
}
export const withdrawLockedSummit = async (everestToken, amount) => {
  return callWithEstimateGas(
    everestToken,
    'withdrawLockedSummit',
    [new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()]
  )
}
export const lockFarmSummitForEverest = async (cartographer, sourceElevation, amount) => {
  return callWithEstimateGas(
    cartographer,
    'elevateAndLockStakedSummit',
    [
      elevationUtils.toInt(sourceElevation),
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    ]
  )
}
export const panicWithdrawalLockedSummit = async (everestToken) => {
  return callWithEstimateGas(
    everestToken,
    'panicRecoverFunds',
    []
  )
}

// SUMMIT ECOSYSTEM
export const rolloverElevation = async (cartographer, elevation) => {
  return callWithEstimateGas(
    cartographer,
    'rollover',
    [elevationUtils.toInt(elevation)]
  )
}
export const rolloverExpedition = async (expedition) => {
  return callWithEstimateGas(
    expedition,
    'rollover'
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
