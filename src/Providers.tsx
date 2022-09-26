import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import { ModalProvider } from 'uikit'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { getLibrary } from 'utils'
import { ApolloProvider } from '@apollo/client'
import { client } from 'config/constants/graph'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeContextProvider>
        <ApolloProvider client={client}>
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
