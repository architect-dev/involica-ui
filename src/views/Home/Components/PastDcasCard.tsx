import React from 'react'
import { Card } from '@components/Card'
import { PastDcasTable } from '@components/PastDcasTable'

export const PastDcasCard: React.FC = () => {
	return (
		<Card title='Executed DCAs' padding='24px'>
			<PastDcasTable />
		</Card>
	)
}
