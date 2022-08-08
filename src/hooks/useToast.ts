import { IsSummitRevertReason } from 'config/constants/types'
import { ToastsContext } from 'contexts/ToastsContext'
import { useContext, useCallback } from 'react'
import { Toast } from 'uikit/widgets/Toast'

type ToastSignature = (title: Toast['title'], description?: Toast['description']) => void

const useToast = () => {
  const toastContext = useContext(ToastsContext)

  if (toastContext === undefined) {
    throw new Error('Toasts context undefined')
  }

  return toastContext
}

export default useToast


export const useTransactionToasts = () => {
  const { toastSuccess, toastError } = useToast()

  const transactionToastError: ToastSignature = useCallback(
    (title: Toast['title'], description: Toast['description']) => {
      console.log({
        title,
        description
      })
      const errorTitle = IsSummitRevertReason[description] ? title : 'Wallet / Chain Error'
      toastError(errorTitle, description.split('_').join(' '))
    },
    [toastError]
  )

  return { toastSuccess, toastError: transactionToastError }
}
