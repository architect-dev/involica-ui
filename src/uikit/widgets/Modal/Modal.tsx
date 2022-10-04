import React from 'react'
import styled from 'styled-components'
import Heading from '../../components/Heading/Heading'
import Flex from '../../components/Box/Flex'
import { ArrowBackIcon, CloseIcon } from '../../components/Svg'
import { IconButton } from '../../components/Button'
import { InjectedProps } from './types'
import { X } from 'react-feather'

interface Props extends InjectedProps {
  title: string
  HeaderComponent?: React.ReactNode
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  headerless?: boolean
  elevationCircleHeader?: string
}

const StyledModal = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin: 12px;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow: visible;
  max-height: calc(100% - 100px);
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: calc(100% - 140px);
    width: auto;
    min-width: 340px;
    max-width: calc(100% - 18px);
    margin-top: 130px;
  }
`

const ScrollableContent = styled(Flex)`
  overflow: auto;
  height: 100%;
  width: 100%;
  padding-top: 24px;
`

const StyledCloseIcon = styled(CloseIcon)`
  fill: ${({ theme }) => (theme.isDark ? theme.colors.text : '')};
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 12px 24px;
`

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`

const AbsoluteIconButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
`

const Modal: React.FC<Props> = ({
  title,
  HeaderComponent,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '24px',
  headerless = false,
}) => {
    return (
    <StyledModal>
      {!headerless && (
        <ModalHeader>
          <ModalTitle>
            {onBack && (
              <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
                <ArrowBackIcon color="primary" />
              </IconButton>
            )}
            <Heading>{title}</Heading>
          </ModalTitle>
          {!hideCloseButton && (
            <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
              <X size='14px'/>
            </IconButton>
          )}
        </ModalHeader>
      )}
      { HeaderComponent != null && HeaderComponent}
      <ScrollableContent flexDirection="column" p={bodyPadding}>
        {children}
        {headerless && !hideCloseButton && (
          <AbsoluteIconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
            <StyledCloseIcon color="primary" />
          </AbsoluteIconButton>
        )}
      </ScrollableContent>
    </StyledModal>
  )
}

export default Modal
