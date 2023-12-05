import { transparentize } from 'polished'
import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@uikit'

declare module 'styled-components' {
	/* eslint-disable @typescript-eslint/no-empty-interface */
	export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Andale Mono, monospace;
  }
  html {
    /* overflow-x: hidden; */
  }
  body {
    /* background-color: ${({ theme }) => theme.colors.background}; */
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
    background-color: ${({ theme }) => transparentize(0.7, theme.colors.text)};
  }
  .popup-arrow {
    color: ${({ theme }) => theme.colors.background};
    top: 1px;
  }
  .popup-content {
    border-radius: 4px;
  }
  [role='tooltip'].popup-content {
    filter: drop-shadow(2px 2px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
    margin-top: 0px;
  }
  [role='dialog'].popup-content {
    margin: 95px auto auto auto !important;
    max-height: calc(100vh - 48px);

    @keyframes pop {
      0% {
        transform: translate(0px, 0px);
        filter: drop-shadow(0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
      }
      1% {
        transform: translate(0px, 0px);
        filter: drop-shadow(0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
      }
      100% {
        transform: translate(-1px, -1px);
        filter: drop-shadow(2px 2px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)});
      }
    }
    animation: pop 200ms ease-in-out forwards;
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
