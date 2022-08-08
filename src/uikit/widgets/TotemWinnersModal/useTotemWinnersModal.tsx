import React from 'react'
import { useModal } from '../Modal'
import TotemWinnersModal from './TotemWinnersModal'

interface ReturnType {
  onPresentTotemWinnersModal: ({ elevation: Elevation }) => void
}

const useTotemWinnersModal = (): ReturnType => {
  const [onPresentTotemWinnersModal] = useModal(
    <TotemWinnersModal/>,
  )
  return { onPresentTotemWinnersModal }
}

export default useTotemWinnersModal
