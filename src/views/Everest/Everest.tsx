import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
import { UserEverestCard, EverestStatsCard } from './components'
import styled from 'styled-components'
import { ElevationPuck, Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import useRefresh from 'hooks/useRefresh'
import PageLoader from 'components/PageLoader'
import { useEverestDataLoaded } from 'state/hooksNew'
import { fetchEverestDataAsync } from 'state/everest'

const HeaderCardsWrapper = styled(Flex)`
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 32px;
    margin: 64px auto 0px auto;
    max-width: 850px;
    position: relative;
`

const Everest: React.FC = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchEverestDataAsync(account))
  }, [account, dispatch, fastRefresh])

  const everestDataLoaded = useEverestDataLoaded()



  return (
    <Page>
      <HeaderCardsWrapper>
        <ElevationPuck elevation='EVEREST'/>
      </HeaderCardsWrapper>
      <FlexLayout>
        { (everestDataLoaded || account == null) ?
          <Flex gap='24px' width='100%' flexWrap='wrap' alignItems='flex-start' justifyContent='center'>
            <UserEverestCard/>
            <EverestStatsCard/>
          </Flex> :
          <PageLoader fill loadingText='Loading Everest Data...'/>
        }
      </FlexLayout>
    </Page>
  )
}

export default Everest
