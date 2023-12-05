import { transparentize } from 'polished'
import React, { Ref, useCallback, useRef } from 'react'
import { X } from 'react-feather'
import Popup from 'reactjs-popup'
import styled from 'styled-components'
import { Text } from '../../components/Text/Text'
import { PopupActions } from 'reactjs-popup/dist/types'

interface Props {
	button?: JSX.Element
	position?: any
	contentPadding?: string
	popUpContent: JSX.Element | null
	popUpTitle?: React.ReactNode
	open?: boolean
	modal?: boolean
	callOnDismiss?: () => void
	className?: string
}

const StyledPopup = styled(Popup)`
	/* &-content {
    margin: 95px auto auto auto !important;
    max-height: calc(100vh - 48px) !important;
  } */
`

export const ModalContentContainer = styled.div<{
	alignItems?: string
	justifyContent?: string
	padding?: string
	minWidth?: string
	maxWidth?: string
	width?: string
	height?: string
	minHeight?: string
	maxHeight?: string
	gap?: string
}>`
	display: flex;
	flex-direction: column;
	display: flex;
	align-items: ${({ alignItems }) => alignItems ?? 'center'};
	justify-content: ${({ justifyContent }) => justifyContent ?? 'center'};
	width: ${({ width }) => width ?? 'auto'};
	min-width: ${({ minWidth }) => minWidth ?? '300px'};
	max-width: ${({ maxWidth }) => maxWidth ?? '600px'};
	height: ${({ height }) => height ?? 'auto'};
	min-height: ${({ minHeight }) => minHeight ?? 'auto'};
	/* max-height: ${({ maxHeight }) => `min(${maxHeight ?? '100%'}, calc(100vh - 115px))`}; */
	/* max-height: min(800px, calc(100vh - 48px)); */
	/* max-height: calc(100vh - 48px); */
	max-height: min(${({ maxHeight }) => maxHeight ?? '100%'}, calc(100vh - 48px));
	gap: ${({ gap }) => gap ?? '18px'};
	padding: ${({ padding }) => padding ?? '56px 0px 18px 0px'};
`

const PopUpCard = styled.div<{ padding?: string }>`
	flex-direction: column;
	justify-content: flex-start;
	flex: 1;
	position: relative;
	max-height: calc(100vh - 48px);
	background-color: ${({ theme }) => theme.colors.background};
	border-radius: 4px;
`

const Scrollable = styled.div<{ padding?: string }>`
	flex-direction: column;
	justify-content: flex-start;
	flex: 1;
	position: relative;
	max-height: calc(100vh - 48px);
	padding: 0px ${({ padding }) => padding ?? '18px'};
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
	-ms-overflow-style: none;
	::-webkit-scrollbar {
		display: none;
	}
`

const PopUpHeader = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 56px;
	background: ${({ theme }) => `linear-gradient(to bottom, ${theme.colors.background} 70%, ${transparentize(1, theme.colors.background)} 100%)`};
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 2;
	border-radius: 4px 4px 0 0;
`
const PopUpFooterGradient = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 16px;
	background: ${({ theme }) => `linear-gradient(to top, ${theme.colors.background} 25%, ${transparentize(1, theme.colors.background)} 100%)`};
	z-index: 2;
	border-radius: 0 0 4px 4px;
`

const CloseIcon = styled(X)`
	position: absolute;
	top: 20px;
	right: 20px;
	stroke: ${({ theme }) => theme.colors.text};
	cursor: pointer;

	&:hover {
		stroke-width: 3;
	}
`

export const SummitPopUp: React.FC<Props> = React.memo(
	({ button, position, contentPadding, popUpContent, popUpTitle, open, callOnDismiss, modal, className }) => {
		const ref = useRef<Ref<PopupActions>>()
		const onDismiss = useCallback(() => {
			if (callOnDismiss != null) callOnDismiss()
			if (ref.current != null) {
				// @ts-expect-error ref.current type is unknown
				ref.current.close()
			}
		}, [ref, callOnDismiss])
		let WrappedButton = null
		if (typeof button === 'object' && typeof button.type === 'function') {
			WrappedButton =
				button &&
				React.forwardRef((props, buttonRef: React.ForwardedRef<HTMLDivElement>) => (
					<span {...props} ref={buttonRef}>
						{button}
					</span>
				))
		}

		return (
			<StyledPopup
				trigger={WrappedButton ? <WrappedButton /> : button}
				position={position}
				closeOnDocumentClick
				closeOnEscape
				// @ts-expect-error Ref may not match
				ref={ref}
				modal={modal}
				offsetX={0}
				offsetY={10}
				open={open}
				arrow
				onClose={onDismiss}
				className={className}
			>
				<PopUpCard padding={contentPadding}>
					{popUpTitle != null && (
						<PopUpHeader>
							<Text bold>{popUpTitle}</Text>
							<CloseIcon onClick={onDismiss} size={16} />
						</PopUpHeader>
					)}
					<Scrollable padding={contentPadding}>
						{popUpContent != null &&
							React.cloneElement(popUpContent, {
								onDismiss,
							})}
					</Scrollable>
					{popUpTitle != null && <PopUpFooterGradient />}
				</PopUpCard>
			</StyledPopup>
		)
	}
)
