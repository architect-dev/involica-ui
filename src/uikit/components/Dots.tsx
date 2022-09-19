/* eslint-disable no-irregular-whitespace */
import styled, { css } from "styled-components";

export const Dots = styled.span<{ loading?: boolean }>`
  color: inherit;
  ${({ loading = true }) => loading && css`
    &::after {
      display: inline-block;
      animation: ellipsis 2s infinite;
      content: ".  ";
      text-align: left;
      color: inherit;
    }
    @keyframes ellipsis {
      0% {
        content: ".  ";
      }
      33% {
        content: ".. ";
      }
      66% {
        content: "...";
      }
    }
  `}
`
