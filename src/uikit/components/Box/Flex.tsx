import styled from 'styled-components'
import { flexbox } from 'styled-system'
import Box from './Box'
import { FlexProps } from './types'

const Flex = styled(Box)<FlexProps>`
  display: flex;
  gap: ${({ gap }) => gap != null ? gap : 'none'};
  ${flexbox}
`

export const Row = styled(Flex)`
  flex-direction: row;
  align-items: center;
  width: 100%;
`
export const RowCenter = styled(Row)`
  justify-content: center;
`
export const RowStart = styled(Row)`
  justify-content: flex-start;
`
export const RowEnd = styled(Row)`
  justify-content: flex-end;
`
export const RowBetween = styled(Row)`
  justify-content: space-between;
`
export const Column = styled(Flex)`
  flex-direction: column;
`
export const ColumnStart = styled(Column)`
  justify-content: flex-start;
`

export const MobileColumnFlex = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
  }
`

export const MobileRowFlex = styled(Flex)`
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: column;
  }
`

export default Flex
