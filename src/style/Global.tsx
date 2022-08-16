import { transparentize } from 'polished'
import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: monospace;
  }
  html {
    /* overflow-x: hidden; */
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    position: relative;
    /* overflow-x: hidden; */

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
  .popup-overlay {
    background-color: ${({ theme }) => transparentize(0.8, theme.colors.text)};
    backdrop-filter: blur(2px);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
`

export default GlobalStyle
