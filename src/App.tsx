import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'uikit'
import BigNumber from 'bignumber.js'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import styled from 'styled-components'
import { ToastListener } from 'contexts/ToastsContext'
import Background from 'components/Background'
import { useFetchPublicData, useFetchUserData } from 'state/hooks'

const Home = lazy(() => import('./views/Home'))
const NotFound = lazy(() => import('./views/NotFound'))

const StyledRouter = styled(Router)`
  position: relative;
`

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const PublicHook = () => {
  useFetchPublicData()
  return null
}

const UserHook = () => {
  useFetchUserData()  
  return null
}

const App: React.FC = () => {

  return (
    <StyledRouter>
      <ResetCSS />
      <GlobalStyle />
      <PublicHook />
      <UserHook />
      <Background />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <ToastListener />
    </StyledRouter>
  )
}

export default React.memo(App)
