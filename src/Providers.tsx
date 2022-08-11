import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import { ModalProvider } from 'uikit'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { getLibrary } from 'utils'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeContextProvider>
        <ToastsProvider>
          <ModalProvider>
            <RefreshContextProvider>{children}</RefreshContextProvider>
          </ModalProvider>
        </ToastsProvider>
      </ThemeContextProvider>
    </Web3ReactProvider>
  )
}

export default Providers
