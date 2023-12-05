import React from 'react'
import { Login } from '../WalletModal/types'
import { Nullable } from '@utils'

export interface LangType {
	code: string
	language: string
}

export interface Profile {
	username?: string
	image?: string
	profileLink: string
	noProfileLink: string
	showPip?: boolean
}

export interface PushedProps {
	isPushed: boolean
	pushNav: (isPushed: boolean) => void
}

export interface NavTheme {
	background: string
	hover: string
}

export interface MenuEntry {
	gap?: boolean
	label?: React.ReactNode
	palette?: string
	icon?: string
	href: string
	external?: boolean
	calloutClass?: string
	initialOpenState?: boolean
	disabled?: boolean
	neverHighlight?: boolean
	keyPaths?: string[]
}

export interface PanelProps {
	links: Array<MenuEntry>
	additionals: Array<MenuEntry>
}

export interface NavProps extends PanelProps {
	isDark: boolean
	toggleTheme: () => void
	account: Nullable<string>
	login: Login
	profile?: Profile
	logout: () => void
}
