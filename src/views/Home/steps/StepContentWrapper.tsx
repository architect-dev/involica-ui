import React from 'react'
import styled from "styled-components";

const StepWrapper = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  border-left: 1px dashed ${({ theme }) => theme.colors.text};
  padding: ${({ expanded }) => (expanded ? '54px' : '4px 54px')};
  transition: padding 200ms;
  margin-left: 4px;
`

export const StepContentWrapper: React.FC<{ expanded: boolean, children }> = ({ expanded, children }) => {
  return (
    <StepWrapper expanded={expanded}>
      {expanded && children}
    </StepWrapper>
  )
}