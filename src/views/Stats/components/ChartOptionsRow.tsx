import React, { useCallback } from 'react'
import OptionSelector from '@components/OptionSelector'
import { Row, RowBetween, RowStart, SummitButton, Text } from '@uikit'
import { ChartDataOption, useChartOptionsState } from './chartOptionsState'
import { X } from 'react-feather'
import TokenIconAndSymbol from '@components/TokenIconAndSymbol'
import { CensoredButton } from './CensoredButton'

export const ChartOptionsRow: React.FC = () => {
	const { dataOption, setDataOption, focusedToken, setFocusedToken, dcasCountChart, setDcasCountChart, censored, toggleCensored } = useChartOptionsState()
	const handleClearDcasCountChart = useCallback(() => {
		setDcasCountChart(dataOption, false)
	}, [dataOption, setDcasCountChart])
	const handleClearFocusedToken = useCallback(() => {
		setFocusedToken(null)
	}, [setFocusedToken])
	return (
		<RowBetween pr='24px'>
			<Row gap='16px' alignItems='flex-start'>
				<OptionSelector<ChartDataOption>
					buttonWidth={100}
					options={[
						{ value: ChartDataOption.User, label: 'Portfolio' },
						{ value: ChartDataOption.Involica, label: 'Involica' },
					]}
					selected={dataOption}
					select={setDataOption}
				/>
				{dataOption === ChartDataOption.User && focusedToken != null && (
					<SummitButton onClick={handleClearFocusedToken} padding='0 8px 0 2px' width='100px'>
						<RowBetween>
							<RowStart gap='4px'>
								<TokenIconAndSymbol token={focusedToken} />
							</RowStart>
							<X size='16px' />
						</RowBetween>
					</SummitButton>
				)}
				{dcasCountChart ? (
					<SummitButton onClick={handleClearDcasCountChart} padding='0 8px 0 12px' width='100px'>
						<RowBetween>
							DCAs
							<X size='16px' />
						</RowBetween>
					</SummitButton>
				) : (
					<Text>Performance</Text>
				)}
			</Row>
			<CensoredButton censored={censored} toggleCensored={toggleCensored} />
		</RowBetween>
	)
}
