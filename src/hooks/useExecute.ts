import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useERC20, useInvolica } from './useContract'
import useToast from './useToast'
import { useInvolicaStore } from 'state/store'
import { Contract, PayableOverrides } from '@ethersproject/contracts'
import { callWithEstimateGas } from 'utils/estimateGas'
import { ethers } from 'ethers'
import { eN } from 'utils'
import { usePositionTokenInWithData, useUserHasPosition } from 'state/hooks'
import { useSubmissionReadyPositionConfig } from 'state/configHooks'

interface ExecuteParams {
  contract: Contract
  method: string
  args?: any[]
  overrides?: PayableOverrides
  successMsg: string
  errorMsg: string
  callback?: (...cbArgs: any[]) => void
  hydrateConfig?: boolean
}

const useExecuteTx = () => {
  const fetchUserData = useInvolicaStore((state) => state.fetchUserData)
  const fetchPublicData = useInvolicaStore((state) => state.fetchPublicData)
  const onHydrateConfig = useInvolicaStore((state) => state.hydrateConfig)
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()

  const handleExecute = useCallback(
    async ({
      contract,
      method,
      args = [],
      overrides = undefined,
      successMsg,
      errorMsg,
      callback,
      hydrateConfig = false,
    }: ExecuteParams) => {
      try {
        setPending(true)
        await callWithEstimateGas(contract, method, args, overrides)
        toastSuccess(successMsg)
        if (hydrateConfig) onHydrateConfig()
      } catch (error) {
        toastError(errorMsg, (error as Error).message)
      } finally {
        setPending(false)
        fetchUserData(account)
        fetchPublicData()
        if (callback != null) callback()
      }
    },
    [toastSuccess, toastError, fetchUserData, account, fetchPublicData, onHydrateConfig],
  )

  return { handleExecute, pending }
}

export const useApprove = (symbol: string, erc20Address: string) => {
  const erc20Contract = useERC20(erc20Address)
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onInfApprove = useCallback(() => {
    handleExecute({
      contract: erc20Contract,
      method: 'approve',
      args: [involica.address, ethers.constants.MaxUint256],
      successMsg: `Approved ${symbol}`,
      errorMsg: `${symbol} Approval Failed`,
    })
  }, [erc20Contract, involica, handleExecute, symbol])

  const onApprove = useCallback(
    (amount: string, decimals: number) => {
      const amountRaw = eN(amount, decimals)
      handleExecute({
        contract: erc20Contract,
        method: 'approve',
        args: [involica.address, amountRaw],
        successMsg: `Approved ${symbol}`,
        errorMsg: `${symbol} Approval Failed`,
      })
    },
    [erc20Contract, involica, handleExecute, symbol],
  )

  return { onApprove, onInfApprove, pending }
}

export const useRevokeApproval = () => {
  const { tokenInData } = usePositionTokenInWithData()
  const erc20Contract = useERC20(tokenInData?.address)
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onRevokeApproval = useCallback(() => {
    handleExecute({
      contract: erc20Contract,
      method: 'approve',
      args: [involica.address, '0'],
      successMsg: `Revoked ${tokenInData?.symbol} Approval, DCAs halted`,
      errorMsg: `${tokenInData?.symbol} Approval Revocation Failed`,
    })
  }, [handleExecute, erc20Contract, involica.address, tokenInData?.symbol])

  return { onRevokeApproval, pending }
}

export const useDepositTreasury = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onDepositTreasury = useCallback(
    (amount: string, decimals: number) => {
      const amountRaw = eN(amount, decimals)
      handleExecute({
        contract: involica,
        method: 'depositTreasury',
        overrides: { value: amountRaw },
        successMsg: `Funds Added`,
        errorMsg: 'Error Adding Funds',
      })
    },
    [handleExecute, involica],
  )

  return { onDepositTreasury, pending }
}

export const useWithdrawTreasury = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onWithdrawTreasury = useCallback(
    (amount: string, decimals: number) => {
      const amountRaw = eN(amount, decimals)
      handleExecute({
        contract: involica,
        method: 'withdrawTreasury',
        args: [amountRaw],
        successMsg: `Withdrew Funds`,
        errorMsg: 'Error Withdrawing Funds',
      })
    },
    [handleExecute, involica],
  )

  return { onWithdrawTreasury, pending }
}

export const useCreateAndFundPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onCreateAndFundPosition = useCallback(
    (config: any[], treasuryValue: string) => {
      handleExecute({
        contract: involica,
        method: 'createAndFundPosition',
        args: config,
        overrides: { value: treasuryValue },
        successMsg: 'Position Created',
        errorMsg: 'Error Creating Position',
        hydrateConfig: true,
      })
    },
    [handleExecute, involica],
  )

  return { onCreateAndFundPosition, pending }
}

export const useSetPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()
  const userHasPosition = useUserHasPosition()
  const positionConfig = useSubmissionReadyPositionConfig()

  const onSetPosition = useCallback(() => {
    handleExecute({
      contract: involica,
      method: 'setPosition',
      args: positionConfig,
      successMsg: userHasPosition ? 'Position Updated' : 'Position Created',
      errorMsg: userHasPosition ? 'Error Updating Position' : 'Error Creating Position',
      hydrateConfig: true,
    })
  }, [handleExecute, involica, userHasPosition, positionConfig])

  return { onSetPosition, pending }
}

export const useManuallyExecuteDCA = () => {
  const { account } = useWeb3React()
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()
  const { tokenInData } = usePositionTokenInWithData()

  const onManuallyExecuteDCA = useCallback(() => {
    handleExecute({
      contract: involica,
      method: 'executeDCA',
      args: [account, tokenInData?.price],
      successMsg: 'DCA Executed Manually',
      errorMsg: 'Manual DCA Execution Failed',
    })
  }, [account, handleExecute, involica, tokenInData?.price])

  return { onManuallyExecuteDCA, pending }
}

export const usePausePosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onPausePosition = useCallback(
    (pause: boolean) => {
      handleExecute({
        contract: involica,
        method: 'pausePosition',
        args: [pause],
        successMsg: pause ? 'Position Paused' : 'Position Unpaused',
        errorMsg: pause ? 'Error Pausing Position' : 'Error Unpausing Position',
      })
    },
    [handleExecute, involica],
  )

  return { onPausePosition, pending }
}

export const useReInitPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onReInitPosition = useCallback(() => {
    handleExecute({
      contract: involica,
      method: 'reInitPosition',
      successMsg: `Position Re-Initialized`,
      errorMsg: 'Error Re-Initializing Position',
      hydrateConfig: true,
    })
  }, [handleExecute, involica])

  return { onReInitPosition, pending }
}

export const useExitPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onExitPosition = useCallback(() => {
    handleExecute({
      contract: involica,
      method: 'exitPosition',
      successMsg: `Position Exited`,
      errorMsg: 'Error Exiting Position',
      hydrateConfig: true,
    })
  }, [handleExecute, involica])

  return { onExitPosition, pending }
}

// TODO: this somehow, need position, prices, routes to calculate meaningful amount outs min, maybe add to fetcher?
// export const useManualExecuteDCA = () => {
//   const { account } = useWeb3React()
//   const involica = useInvolica()
//   const { handleExecute, pending } = useExecuteTx()

//   const onManualExecuteDCA = useCallback(
//     (position: Position) => {
//       const swapsAmountOutMin = position.outs.map((out) => {
//         return
//       })
//       handleExecute(
//         involica,
//         'executeDCA',
//         [account, swapsAmountOutMin],
//         `DCA Executed`,
//         'Error Executing DCA'
//       )
//     },
//     [handleExecute, involica, account]
//   )

//   return { onManualExecuteDCA, pending }
// }
