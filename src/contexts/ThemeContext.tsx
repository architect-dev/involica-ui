import React, { ReactNode, useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { dark, light } from '@theme'
import { LocalStorageKey, readFromLocalStorage, writeToLocalStorage } from '@utils'

const ThemeContext = React.createContext({
	isDark: false,
	toggleTheme: () => {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setPageForcedDark: (_forced: boolean) => {},
})

const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [pageForcedDark, setForcedDark] = useState(false)
	const [isDark, setIsDark] = useState(() => readFromLocalStorage({ key: LocalStorageKey.IS_DARK, readDefault: false }))

	const toggleTheme = () => {
		setIsDark((prevState: boolean) => {
			writeToLocalStorage({ key: LocalStorageKey.IS_DARK, value: JSON.stringify(!prevState) })
			return !prevState
		})
	}

	const setPageForcedDark = (forced: boolean) => {
		setForcedDark(forced)
	}

	return (
		<ThemeContext.Provider value={{ isDark: isDark || pageForcedDark, toggleTheme, setPageForcedDark }}>
			<SCThemeProvider theme={isDark || pageForcedDark ? dark : light}>{children}</SCThemeProvider>
		</ThemeContext.Provider>
	)
}

export { ThemeContext, ThemeContextProvider }
