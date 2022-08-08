import React, { useEffect, Suspense, lazy } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useFetchExpeditionApr, useFetchPublicData } from 'state/hooks'
import useGetDocumentTitlePrice from './hooks/useGetDocumentTitlePrice'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import { fetchFarmUserDataAsync } from 'state/farms'
import { fetchUserTotemsAsync, setActiveAccount } from 'state/summitEcosystem'
import ElevationBackground from 'components/ElevationBackground'
import styled from 'styled-components'
import ExpeditionBackground from 'components/ExpeditionBackground'
import { ToastListener } from 'contexts/ToastsContext'
import PageForcedDarkComponent from 'PageForcedDarkComponent'
import { useFetchExpeditionPotTotalValue } from 'hooks/useFetchExpeditionPotTotalValue'
import { fetchTokensUserDataAsync } from 'state/tokens'
import { fetchUserEpochsAsync } from 'state/glacier'
import { fetchEverestDataAsync } from 'state/everest'
import RoundRolloversTracker from 'RoundRolloversTracker'
import { fetchExpeditionUserDataAsync, updateExpeditionUserWinningsAsync } from 'state/expedition'
import useEagerConnect from 'hooks/useEagerConnect'

const Home = lazy(() => import('./views/Home'))
const ElevationFarms = lazy(() => import('./views/ElevationFarms'))
const Glacier = lazy(() => import('./views/Glacier'))
const Everest = lazy(() => import('./views/Everest'))
const ExpeditionFarms = lazy(() => import('./views/Expeditions'))
const NotFound = lazy(() => import('./views/NotFound'))
const BetaTokens = lazy(() => import('./views/Beta'))
const Roadmap = lazy(() => import('./views/TravelersRoadmap'))

const StyledRouter = styled(Router)`
  position: relative;
`

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GlobalHooks = () => {
  useFetchExpeditionApr()
  useFetchPublicData()
  useGetDocumentTitlePrice()
  useFetchExpeditionPotTotalValue()
  useEagerConnect()
  return null
}

const App: React.FC = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(setActiveAccount(account))
      dispatch(fetchExpeditionUserDataAsync(account))
      dispatch(updateExpeditionUserWinningsAsync(account))
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchUserTotemsAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
      dispatch(fetchUserEpochsAsync(account))
      dispatch(fetchEverestDataAsync(account))
    }
  }, [account, dispatch])

  return (
    <StyledRouter>
      <ResetCSS />
      <GlobalStyle />
      <GlobalHooks />
      <ElevationBackground />
      {/* <RoadmapClouds/> */}
      <ExpeditionBackground />
      <PageForcedDarkComponent />
      <RoundRolloversTracker />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            {/* { ChainIncludesBetaTab() && */}
            <Route path='/rollover' exact>
              <BetaTokens />
            </Route>
            {/* } */}
            <Route path='/portfolio' exact>
              <Roadmap />
            </Route>
            <Route path={['/elevations', '/oasis', '/plains', '/mesa', '/summit']}>
              <ElevationFarms />
            </Route>
            <Route path='/glacier' exact>
              <Glacier />
            </Route>
            <Route path='/everest' exact>
              <Everest />
            </Route>
            <Route path="/expedition">
              <ExpeditionFarms />
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
