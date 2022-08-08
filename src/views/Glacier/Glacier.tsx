import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
import EpochsHeaderCard, { FrozenEpochs } from './components'
import styled from 'styled-components'
import { Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import { fetchUserEpochsAsync } from 'state/glacier'
import useRefresh from 'hooks/useRefresh'

const HeaderCardsWrapper = styled(Flex)`
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 32px;
    margin: 0px auto 32px auto;
    max-width: 850px;
`

const Glacier: React.FC = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchUserEpochsAsync(account))
    }
  }, [account, dispatch, fastRefresh])


  return (
    <Page>
      <HeaderCardsWrapper>
        <EpochsHeaderCard/>
      </HeaderCardsWrapper>
      <FlexLayout>
        <FrozenEpochs/>
      </FlexLayout>
    </Page>
  )
}

export default Glacier
