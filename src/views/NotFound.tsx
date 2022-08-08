import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'uikit'
import Page from 'components/layout/Page'
import SummitButton from 'uikit/components/Button/SummitButton'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 264px);
  justify-content: center;
`

const NotFound = () => {
  return (
    <Page>
      <StyledNotFound>
        <Heading size="xxl">404</Heading>
        <Text monospace mb="48px">
          Page Not Found
        </Text>
        <SummitButton as="a" href="/">
          BACK TO HOME
        </SummitButton>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
