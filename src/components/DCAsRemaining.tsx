import React from 'react'
import { useDcasRemaining, usePositionLimitingFactor } from '@state/hooks'
import { PositionLimitingFactor } from '@state/status'
import { Text } from '@uikit'

const LimitingFactor: React.FC = () => {
	const limitingFactor = usePositionLimitingFactor()
	if (limitingFactor === PositionLimitingFactor.None) return null
	return (
		<>
			<br />
			<Text italic fontSize='11px'>
				(before <b>{limitingFactor}</b> runs out)
			</Text>
		</>
	)
}

export const DCAsRemainingLabel: React.FC = () => {
	return (
		<Text small italic>
			DCAs Remaining:
			<LimitingFactor />
		</Text>
	)
}

export const DCAsRemaining: React.FC = () => {
	const dcasRemaining = useDcasRemaining()
	return (
		<Text bold textAlign='right'>
			{dcasRemaining}
		</Text>
	)
}
