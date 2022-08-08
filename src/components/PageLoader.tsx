import React from 'react'
import styled from 'styled-components'
import { Text, Token3DFloating } from 'uikit'
import Page from './layout/Page'

const Wrapper = styled(Page)<{ fillArea: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: ${({ fillArea }) => (fillArea ? 'min-height: calc(100vh - 64px)' : '0px')};
  justify-content: center;
  align-items: center;
`

const LogoIcon = styled(Token3DFloating)`
  transition: transform 0.3s ease;
  margin-bottom: 24px;
  animation: loadingSpin 2s ease-in-out infinite;
  @keyframes loadingSpin {
    0% {
      transform: rotate(10deg) translateY(0px);
    }
    50% {
      transform: rotate(10deg) translateY(15px);
    }
    100% {
      transform: rotate(10deg) translateY(0px);
    }
  }
`

interface Props {
  fill?: boolean
  loadingText?: string
}

const PageLoader: React.FC<Props> = ({ fill = true, loadingText }) => {
  return (
    <Wrapper fillArea={fill}>
      <LogoIcon width="72px" />
      { loadingText != null && <Text mt='-8px' bold monospace>{loadingText}...</Text> }
    </Wrapper>
  )
}

export default PageLoader
