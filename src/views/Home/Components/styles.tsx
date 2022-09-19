import { transparentize } from "polished"
import styled from "styled-components"

export const CellRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 18px;
  flex-wrap: wrap;
`

export const CellCol = styled.div<{ justifyContent?: string }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  justify-content: ${({ justifyContent }) => justifyContent ?? 'space-between'};
  gap: 18px;
  width: 100%;
`
export const CellWithChanged = styled(CellCol)<{ changed?: boolean, gap?: string }>`
  background-color: ${({ theme, changed }) => (changed ? transparentize(0.8, theme.colors.warning) : 'transparent')};
  padding: 12px;
  width: 100%;
  gap: ${({ gap }) => gap ?? '24px'};
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
`

export const DesktopOnlyPre = styled.pre`
  display: none;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: initial;
  }
`


