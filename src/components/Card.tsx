import { transparentize } from 'polished'
import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Text } from 'uikit'

const StyledFieldset = styled.fieldset<{
  halfWidth: boolean
  expanded: boolean
  mobilePadding?: string
  padding?: string
}>`
  background-color: #fff6eb80;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  border-radius: 4px;
  padding: ${({ mobilePadding, expanded }) => mobilePadding ?? (expanded ? '16px' : '2px 20px')};
  margin-bottom: ${({ expanded }) => (expanded ? '0px' : 'auto')};
  transition: padding 200ms, box-shadow 200ms ease-in-out, transform 200ms ease-in-out, background-color 200ms ease-in-out;
  border: dashed ${({ theme }) => theme.colors.text};
  border-width: 1px;
  min-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.nav} {
    min-width: ${({ halfWidth }) => (halfWidth ? 'calc(50% - 12px)' : '100%')};
    width: ${({ halfWidth }) => (halfWidth ? 'calc(50% - 12px)' : '100%')};
    padding: ${({ padding, expanded }) => padding ?? (expanded ? '32px' : '2px 36px')};
  }

  box-shadow: 0px 0px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)};
  transform: none;
  :hover {
    box-shadow: 2px 2px 0px ${({ theme }) => transparentize(0.4, theme.colors.text)};
    transform: translate(-1px, -1px);
    background-color: #fff6eb;
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
  mobilePadding?: string
  padding?: string
}

export const Card: React.FC<Props> = ({
  halfWidth = false,
  expanded = true,
  mobilePadding,
  padding,
  title,
  children,
}) => {
  return (
    <StyledFieldset halfWidth={halfWidth} expanded={expanded} mobilePadding={mobilePadding} padding={padding}>
      <legend className="legend">
        <Text bold px="12px">
          {title}
        </Text>
      </legend>
      {children}
    </StyledFieldset>
  )
}
