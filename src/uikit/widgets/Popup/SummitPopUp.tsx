import { transparentize } from 'polished'
import React, { useCallback, useRef } from 'react'
import Popup from 'reactjs-popup'
import styled from 'styled-components'

interface Props {
  button: JSX.Element
  position?: any
  contentPadding?: string
  popUpContent: JSX.Element
  open?: boolean
	modal?: boolean
  callOnDismiss?: () => void
}

const StyledPopup = styled(Popup)`
  &-content {
    top: 55px !important;
  }
`

const PopUpCard = styled.div<{ contentPadding?: string }>`
  flex-direction: column;
  justify-content: flex-start;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  padding: ${({ contentPadding }) => contentPadding || '18px'};
  flex: 1;
  box-shadow: ${({ theme }) => `2px 2px 4px ${transparentize(0.5, theme.colors.textShadow)}`};
`

const SummitPopUp: React.FC<Props> = ({
  button,
  position,
  contentPadding,
  popUpContent,
  open,
  callOnDismiss,
	modal,
}) => {
  const ref = useRef()
  const onDismiss = useCallback(() => {
		callOnDismiss()
    if (ref.current != null) {
      ((ref.current as unknown) as any).close()
    }
  }, [ref, callOnDismiss])
	let WrappedButton = null;
	if (typeof button === "object" && typeof button.type === "function") {
		WrappedButton = button && React.forwardRef((props, buttonRef: React.ForwardedRef<HTMLDivElement>)=>(
			<span {...props} ref={buttonRef}>{button}</span>));
	}
  return (
    <StyledPopup
      trigger={WrappedButton ? <WrappedButton/> : button}
      position={position}
      closeOnDocumentClick
      closeOnEscape
      ref={ref}
			modal={modal}
      offsetX={0}
      offsetY={0}
      open={open}
      arrow={false}
      onClose={onDismiss}
    >
      <PopUpCard contentPadding={contentPadding}>
        {React.cloneElement(popUpContent, {
          onDismiss,
        })}
      </PopUpCard>
    </StyledPopup>
  )
}

export default React.memo(SummitPopUp)
