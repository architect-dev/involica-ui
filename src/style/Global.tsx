import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Montserrat', sans-serif;
  }
  html {
    overflow-x: hidden;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    position: relative;
    overflow-x: hidden;

    ::-webkit-scrollbar { /* Chrome */
        display: none;
    }
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
