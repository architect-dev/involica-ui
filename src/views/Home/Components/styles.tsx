import { transparentize } from "polished"
import styled from "styled-components"

export const CellCol = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  width: 100%;
`
export const CellWithChanged = styled(CellCol)<{ changed?: boolean }>`
  background-color: ${({ theme, changed }) => (changed ? transparentize(0.8, theme.colors.warning) : 'transparent')};
  padding: 12px;
  width: 100%;
  gap: 24px;
`

export const DesktopOnlyPre = styled.pre`
  display: none;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: initial;
  }
`
