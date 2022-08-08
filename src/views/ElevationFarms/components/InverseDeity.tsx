import styled from 'styled-components'
import { BaseDeity } from '../../../uikit/components/Totem/BaseDeity'

export const InverseDeity = styled(BaseDeity)<{ width?: number }>`
  height: calc(${({ width }) => width || 250}px / 1.358);
  width: ${({ width }) => width || 250}px;
  margin-top: 24px;
  margin-bottom: 24px;
  transition: none;
  transform: ${({ deity: totem }) => (totem === 0 ? 'scaleX(-1)' : 'none')};
  transition: none;

  ${({ theme }) => theme.mediaQueries.invNav} {
    height: calc(200px / 1.358);
    width: 200px;
  }

  &:before {
    transition: none;
  }

  &:after {
    transition: none;
  }

`
