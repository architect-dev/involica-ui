import React, { ReactNode, createContext, useCallback, useState } from 'react'
import { kebabCase } from 'lodash'
import { ToastContextApi } from './types'
import { Toast, toastTypes } from '../../uikit'

export const ToastsContext = createContext<ToastContextApi | undefined>(undefined as any)

export const ToastsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<ToastContextApi['toasts']>([])

	const toast = useCallback(
		({ title, description, type }: Omit<Toast, 'id'>) => {
			setToasts((prevToasts) => {
				const id = kebabCase(title)

				// Remove any existing toasts with the same id
				const currentToasts = prevToasts.filter((prevToast) => prevToast.id !== id)

				return [
					{
						id,
						title,
						description,
						type,
					},
					...currentToasts,
				]
			})
		},
		[setToasts]
	)

	const toastError = (title: string, description?: string) => {
		return toast({ title, description, type: toastTypes.DANGER })
	}
	const toastInfo = (title: string, description?: string) => {
		return toast({ title, description, type: toastTypes.INFO })
	}
	const toastSuccess = (title: string, description?: string) => {
		return toast({ title, description, type: toastTypes.SUCCESS })
	}
	const toastWarning = (title: string, description?: string) => {
		return toast({ title, description, type: toastTypes.WARNING })
	}
	const clear = () => setToasts([])
	const remove = (id: string) => {
		setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
	}

	return <ToastsContext.Provider value={{ toasts, clear, remove, toastError, toastInfo, toastSuccess, toastWarning }}>{children}</ToastsContext.Provider>
}
