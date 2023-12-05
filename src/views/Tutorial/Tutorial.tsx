import React from 'react'
import Page from '@components/layout/Page'
import { IntroSteps } from './steps/IntroSteps'
import { StoneHeader } from '@components/StoneHeader'

const Tutorial: React.FC = () => {
	return (
		<Page>
			<StoneHeader />
			<IntroSteps />
		</Page>
	)
}

export default Tutorial
