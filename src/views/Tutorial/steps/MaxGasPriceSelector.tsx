import OptionSelector from '@components/OptionSelector'
import React, { useCallback } from 'react'
import { useConfigurableMaxGasPrice } from '@state/hooks'
import { MaxGasPriceOptions } from '@state/types'

const MaxGasPriceSelector = () => {
	const { maxGasPrice, setMaxGasPrice } = useConfigurableMaxGasPrice()
	const handleSetMaxGasPrice = useCallback(
		(maxGasPriceRaw: string) => {
			setMaxGasPrice(maxGasPriceRaw as MaxGasPriceOptions)
		},
		[setMaxGasPrice]
	)

	return (
		<OptionSelector<string>
			buttonWidth={100}
			options={[
				{ value: '100', label: '100 gwei' },
				{ value: '200', label: '200 gwei' },
				{ value: '500', label: '500 gwei' },
			]}
			selected={maxGasPrice}
			select={handleSetMaxGasPrice}
		/>
	)
}

export default React.memo(MaxGasPriceSelector)
