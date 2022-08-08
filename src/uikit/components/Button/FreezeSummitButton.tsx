import React from 'react'
import styled from 'styled-components'
import Flex from '../Box/Flex'
import SummitButton from './SummitButton'
import { ButtonProps } from './types'

const FreezeButtonWrapper = styled(Flex)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 38px;
`

const FreezeButtonOverlay = styled.div`
  position: absolute;
  width: 215px;
  height: 100px;
  pointer-events: none;
  background-image: url("/images/summit/FreezeSummitOverlay.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const FreezeSummitButton = (props: ButtonProps): JSX.Element => {
  return (
    <FreezeButtonWrapper>
      <SummitButton
        {...props}
        width='200px'
      />
      <FreezeButtonOverlay/>
    </FreezeButtonWrapper>
  )
}

export default FreezeSummitButton
