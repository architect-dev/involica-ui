import React from 'react'
import { Text } from '@uikit'
import { IntervalSelector } from '@components/IntervalSelector'
import { useIntervalStrings } from '@state/uiHooks'

export const SelectInterval: React.FC = () => {
	const { intervalStringly } = useIntervalStrings()
	return (
		<>
			<Text small>
				Choose how often you want your DCA to execute.
				<br />
				Less time between DCAs reduces your exposure to volitility,
				<br />
				but costs more gas (still only pennies per transaction).
				<br />
			</Text>
			<IntervalSelector intro />
			<Text italic>
				Interval: <b>{intervalStringly}</b>
			</Text>
		</>
	)
}
