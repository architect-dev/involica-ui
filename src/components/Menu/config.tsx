import React from 'react'
import { MenuEntry } from '@uikit'

export const getMenuItems = (): MenuEntry[] =>
	[
		{
			label: 'HOME',
			href: `/`,
			external: false,
			keyPaths: [''],
		},
		{
			label: 'TUTORIAL',
			href: `/tutorial`,
			external: false,
			keyPaths: ['tutorial'],
		},
		{
			label: 'STATS',
			href: '/stats',
			external: false,
			keyPaths: ['stats'],
		},
		{
			label: (
				<>
					INVOLI<s>CA</s>
				</>
			),
			href: '/involi',
			external: false,
			keyPaths: ['involi'],
		},
		{
			label: 'DOCS',
			href: '/docs',
			external: false,
			keyPaths: ['docs'],
		},
	].filter((entry) => entry != null)
