import React, { ReactNode } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { RefreshContextProvider } from '@contexts/RefreshContext'
import { ToastsProvider } from '@contexts/ToastsContext'
import { ModalProvider } from '@uikit'
import { ThemeContextProvider } from '@contexts/ThemeContext'
import { getLibrary } from '@utils'
import { ApolloProvider } from '@apollo/client'
import { spookyswapClient } from '@config/constants/graph'

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<ThemeContextProvider>
				<ApolloProvider client={spookyswapClient}>
					<ToastsProvider>
						<ModalProvider>
							<RefreshContextProvider>{children}</RefreshContextProvider>
						</ModalProvider>
					</ToastsProvider>
				</ApolloProvider>
			</ThemeContextProvider>
		</Web3ReactProvider>
	)
}

export default Providers
