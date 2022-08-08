import styled from 'styled-components'

export default styled.div`
  background-color: ${({ theme }) => theme.colors.selectorBackground};
  width: 2px;
  height: 100%;
  opacity: 0.75;
  display: none;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
  }
`
