import React, { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { Text } from 'uikit/components/Text'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { useDebugActions } from 'state/debugHooks'
import { SummitButton } from 'uikit/components/Button'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'

const ItemFlex = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  ${({ theme }) =>
    pressableMixin({
      theme,
      hoverStyles: css`
        .item-label {
          font-weight: bold;
          text-decoration: underline;
        }
      `,
    })}
`

export const DebugModal: React.FC<{
  onDismiss?: () => void
}> = ({ onDismiss }) => {
  const debugActions = useDebugActions()
  return (
    <ModalContentContainer gap="12px">
      {Object.entries(debugActions).map(([key, action]) => (
        <ItemFlex
          key={key}
          onClick={() => {
            action()
            onDismiss()
          }}
        >
          <Text className="item-label">{key}</Text>
        </ItemFlex>
      ))}
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </ModalContentContainer>
  )
}

const DebugMenu: React.FC<{ account: string | null }> = ({ account }) => {
  const [open, setOpen] = useState(false)
  const hide = useCallback(() => setOpen(false), [setOpen])

  if (
    account !== '0x3a7679E3662bC7c2EB2B1E71FA221dA430c6f64B' &&
    account !== '0x2370b8Ff222e12CC95b0c455B904211A58c28d21'
  )
    return null

  return (
    <SummitPopUp
      position="bottom right"
      button={
        <ItemFlex>
          <Text className="item-label">DEBUG</Text>
        </ItemFlex>
      }
      popUpTitle="Debug Options:"
      popUpContent={<DebugModal />}
      modal
      open={open}
      callOnDismiss={hide}
    />
  )
}

export default React.memo(DebugMenu)
