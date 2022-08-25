import React from 'react'
import styled from 'styled-components'
import { SummitButton, Text } from 'uikit'
import {
  PositionExpectedAndDurationOverview,
  PositionSwapsOverview,
} from './PositionOverviewElements'

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  max-height: 90%;
  gap: 24px;
`

export const ConfigPreviewModal: React.FC<{ onDismiss?: () => void }> = ({
  onDismiss,
}) => {
  return (
    <ModalWrapper>
      <Text bold>Position Preview:</Text>
      <Text px="48px" textAlign="center">
        This preview will start empty, and will fill as you build your position!
      </Text>

      <Text small italic mr="auto">
        DCA Overview:
      </Text>
      <PositionSwapsOverview />

      <Text small italic pr="48px" mr="auto">
        Number of DCAs that are expected to execute based on the amount to DCA
        and DCA interval:
      </Text>
      <PositionExpectedAndDurationOverview />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </ModalWrapper>
  )
}
