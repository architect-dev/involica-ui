import React from 'react'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { store } from 'state'
import { ToastsProvider } from 'contexts/ToastsContext'
import { ModalProvider } from 'uikit'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { getLibrary } from 'utils'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ThemeContextProvider>
          <ToastsProvider>
            <ModalProvider>
              <RefreshContextProvider>{children}</RefreshContextProvider>
            </ModalProvider>
          </ToastsProvider>
        </ThemeContextProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
