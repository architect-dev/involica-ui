import React from 'react'
import styled from 'styled-components'

const BackgroundImage = styled.div`
  background-image: ${({ theme }) => `url("/images/summit/backgroundBASE${theme.isDark ? '_DARK' : '_LIGHT'}.jpg")`};
  position: fixed;
  background-position: center right;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`

const Background: React.FC = () => {
  return (
    <BackgroundImage />
  )

}

export default React.memo(Background)
