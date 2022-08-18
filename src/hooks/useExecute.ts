import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useERC20, useInvolica } from './useContract'
import useToast from './useToast'
import { useInvolicaStore } from 'state/zustand'
import { Contract, PayableOverrides } from '@ethersproject/contracts'
import { callWithEstimateGas } from 'utils/estimateGas'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { eN } from 'utils'

const useExecuteTx = () => {
  const fetchUserData = useInvolicaStore((state) => state.fetchUserData)
  const fetchPublicData = useInvolicaStore((state) => state.fetchPublicData)
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()

  const handleExecute = useCallback(
    async (
      contract: Contract,
      method: string,
      args: any[],
      overrides: PayableOverrides | undefined,
      successMsg: string,
      errorMsg: string,
      callback?: (...cbArgs: any[]) => void,
    ) => {
      try {
        setPending(true)
        await callWithEstimateGas(contract, method, args, overrides)
        toastSuccess(successMsg)
      } catch (error) {
        toastError(errorMsg, (error as Error).message)
      } finally {
        setPending(false)
        fetchUserData(account)
        fetchPublicData()
        if (callback != null) callback()
      }
    },
    [toastSuccess, toastError, fetchUserData, account, fetchPublicData],
  )

  return { handleExecute, pending }
}

export const useApprove = (symbol: string, erc20Address: string) => {
  const erc20Contract = useERC20(erc20Address)
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onInfApprove = useCallback(() => {
    handleExecute(
      erc20Contract,
      'approve',
      [involica.address, ethers.constants.MaxUint256],
      undefined,
      `Approved ${symbol}`,
      `${symbol} Approval Failed`,
    )
  }, [erc20Contract, involica, handleExecute, symbol])

  const onApprove = useCallback(
    (amount: string, decimals: number) => {
      const amountRaw = eN(amount, decimals)
      handleExecute(
        erc20Contract,
        'approve',
        [involica.address, amountRaw],
        undefined,
        `Approved ${symbol}`,
        `${symbol} Approval Failed`,
      )
    },
    [erc20Contract, involica, handleExecute, symbol],
  )

  return { onApprove, onInfApprove, pending }
}

export const useDepositTreasury = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onDepositTreasury = useCallback(
    (amount: string, decimals: number) => {
      const amountRaw = eN(amount, decimals)
      handleExecute(
        involica,
        'depositTreasury',
        [],
        { value: amountRaw },
        `Funds Added`,
        'Error Adding Funds',
      )
    },
    [handleExecute, involica],
  )

  return { onDepositTreasury, pending }
}

export const useWithdrawTreasury = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onWithdrawTreasury = useCallback(
    (amount: BigNumber) => {
      const amountRaw = eN(amount, 18)
      handleExecute(
        involica,
        'withdrawTreasury',
        [amountRaw],
        undefined,
        `Withdrew Funds`,
        'Error Withdrawing Funds',
      )
    },
    [handleExecute, involica],
  )

  return { onWithdrawTreasury, pending }
}

export const useSetPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onSetPosition = useCallback(
    (config: any[], treasuryValue: string, isNewPosition: boolean) => {
      console.log(...config, { value: treasuryValue })
      handleExecute(
        involica,
        'setPosition',
        config,
        { value: treasuryValue },
        isNewPosition ? 'Position Created' : 'Position Updated',
        isNewPosition ? 'Error Creating Position' : 'Error Updating Position',
      )
    },
    [handleExecute, involica],
  )

  return { onSetPosition, pending }
}

export const useReInitPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onReInitPosition = useCallback(() => {
    handleExecute(
      involica,
      'reInitPosition',
      [],
      undefined,
      `Position Re-Initialized`,
      'Error Re-Initializing Position',
    )
  }, [handleExecute, involica])

  return { onReInitPosition, pending }
}

export const useExitPosition = () => {
  const involica = useInvolica()
  const { handleExecute, pending } = useExecuteTx()

  const onExitPosition = useCallback(() => {
    handleExecute(
      involica,
      'exitPosition',
      [],
      undefined,
      `Position Exited`,
      'Error Exiting Position',
    )
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
