import styled from "styled-components";

export const StepContentWrapper = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 18px;
  border-left: 1px dashed ${({ theme }) => theme.colors.text};
  padding: ${({ expanded }) => (expanded ? '54px' : '12px')};
  transition: padding 200ms;
  margin-left: 4px;
`