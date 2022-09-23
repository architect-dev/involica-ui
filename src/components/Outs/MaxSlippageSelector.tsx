import OptionSelector from 'components/OptionSelector'
import React from 'react'
import { usePositionOutConfigurableMaxSlippage } from 'state/hooks'

export const MaxSlippageSelector: React.FC<{ token: string }> = ({ token }) => {
  const { maxSlippage, dirty, current, updateMaxSlippage } = usePositionOutConfigurableMaxSlippage(token)

  return (
    <OptionSelector
      buttonWidth={60}
      options={[
        { value: '0.5', label: '0.5%' },
        { value: '1', label: '1%' },
        { value: '1.5', label: '1.5%' },
      ]}
      selected={`${maxSlippage}`}
      select={updateMaxSlippage}
    />
  )
}
