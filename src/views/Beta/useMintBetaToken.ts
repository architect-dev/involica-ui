import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { betaTokenMint } from 'utils/callHelpers'
import { useTransactionToasts } from 'hooks/useToast'
import { getDummyTokenContract } from 'utils'

export const useMintBetaToken = (symbol: string, tokenAddress: string, decimals: number) => {
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useTransactionToasts()
  const { account } = useWeb3React()

  const handleMint = useCallback(async (amount: number) => {
    try {
      setPending(true)
      const betaToken = getDummyTokenContract(tokenAddress)
      await betaTokenMint(betaToken, amount, account, decimals)
      toastSuccess(`${amount} ${symbol} Minted`)
    } catch (error) {
      toastError(`${symbol} Mint Failed`, (error as Error).message)
    } finally {
      setPending(false)
    }
  }, [account, tokenAddress, decimals, setPending, toastSuccess, toastError, symbol])

  return { onMint: handleMint, pending }
}
