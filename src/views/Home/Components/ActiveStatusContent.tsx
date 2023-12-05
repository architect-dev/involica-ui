import { DataRow } from '@uikit/components/DataRow'
import { DCAsRemainingLabel, DCAsRemaining } from '@components/DCAsRemaining'
import { ManualExecutionModalButton } from '@components/ManualExecutionModal'
import { TimeUntilNextDca } from '@components/TimeUntilNextDca'
import React from 'react'
import { useUpcomingDCAs, usePositionLimitingFactor } from '@state/hooks'
import { ColumnStart, RowStart, Text } from '@uikit'

export const ActiveStatusContent: React.FC = () => {
	const upcomingDCAs = useUpcomingDCAs()
	const limitingFactor = usePositionLimitingFactor()

	return (
		<>
			<DataRow t='Next DCA In:' v={<TimeUntilNextDca />} />
			<DataRow t={<DCAsRemainingLabel />} v={<DCAsRemaining />} />
			<br />
			<DataRow t='Upcoming Executions:' v={<ManualExecutionModalButton />} />
			<ColumnStart gap='0px' width='100%'>
				{upcomingDCAs != null &&
					upcomingDCAs.slice(0, Math.min(upcomingDCAs.length, 5)).map((dateTime) => (
						<RowStart key={dateTime} gap='8px'>
							<Text small>-</Text>
							<Text bold small>
								{dateTime}
							</Text>
						</RowStart>
					))}
				{upcomingDCAs?.length < 6 && (
					<Text bold small color='warning'>
						-- {limitingFactor} runs out --
					</Text>
				)}
				{upcomingDCAs?.length === 6 && (
					<Text small bold>
						<pre> ...</pre>
					</Text>
				)}
			</ColumnStart>
		</>
	)
}
