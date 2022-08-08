import React, { useEffect, useCallback } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarmsLoaded } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import FarmCard from './components/FarmCard/FarmCard'
import styled from 'styled-components'
import TotemHeader from './components/TotemHeader'
import PageLoader from 'components/PageLoader'
import { fetchTokensUserDataAsync } from 'state/tokens'
import FarmFilterRow from './components/FarmFilterRow'
import { useStakedUnstakedFarmSymbols } from 'state/hooksNew'

const NoFarmsFlex = styled(Flex)`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
`

const ElevationFarms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLoaded = useFarmsLoaded()

  const { account } = useWeb3React()
  const [stakedFarms, unstakedFarms] = useStakedUnstakedFarmSymbols()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const stakedFarmsList = useCallback(
    (stakedSymbols) => stakedSymbols.map((symbol) => (
      <FarmCard
        key={symbol}
        symbol={symbol}
      />
    )),
    [],
  )

  const unstakedFarmsList = useCallback(
    (stakedSymbols) => stakedSymbols.map((symbol) => (
      <FarmCard
        key={symbol}
        symbol={symbol}
      />
    )),
    [],
  )

  return (
    <Page>
      <TotemHeader />
      <FarmFilterRow />

      {farmsLoaded ?
        <div>
          {(stakedFarms.length + unstakedFarms.length) === 0 && (
            <NoFarmsFlex justifyContent="center" mt="56px">
              <Text bold monospace fontSize="16px">
                No elevation farms found
              </Text>
            </NoFarmsFlex>
          )}
          <FlexLayout>
            <Route path={`${path}/`}>
              { stakedFarms.length > 0 && 
                <>
                  <Text margin='0px auto 6px 24px' small bold monospace>YOUR FARMS</Text>
                  <Flex flexDirection='column' width='100%'>
                    {stakedFarmsList(stakedFarms)}
                  </Flex>
                  <Text margin='12px auto 6px 24px' small bold monospace>ALL FARMS</Text>
                </>
              }

              <Flex flexDirection='column' width='100%'>
                {unstakedFarmsList(unstakedFarms)}
              </Flex>
            </Route>
          </FlexLayout>
        </div> :
        <PageLoader fill={false} loadingText='Loading Farms...'/>
      }
    </Page>
  )
}

export default ElevationFarms
