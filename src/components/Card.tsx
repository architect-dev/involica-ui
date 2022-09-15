import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Text } from 'uikit'

const StyledFieldset = styled.fieldset<{ halfWidth: boolean, expanded: boolean, padding?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  border-radius: 4px;
  padding: ${({ padding, expanded }) => (padding ?? (expanded ? '32px' : '2px 36px'))};
  margin-bottom: ${({ expanded }) => expanded ? '0px' : 'auto'};
  transition: padding 200ms;
  border: dashed ${({ theme }) => theme.colors.text};
  border-width: 1px;
  min-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.nav} {
    min-width: ${({ halfWidth }) => halfWidth ? 'calc(50% - 12px)' : '100%'};
    width: ${({ halfWidth }) => halfWidth ? 'calc(50% - 12px)' : '100%'};
  }

  .legend {
    margin-right: auto;
  }
`

interface Props {
  halfWidth?: boolean
  expanded?: boolean
  title: string
  children?: ReactNode
  padding?: string
}

export const Card: React.FC<Props> = ({ halfWidth = false, expanded = true, padding, title, children }) => {
  return (
    <StyledFieldset halfWidth={halfWidth} expanded={expanded} padding={padding}>
      <legend className='legend'><Text bold px='12px'>{title}</Text></legend>
      {children}
    </StyledFieldset>
  )
}