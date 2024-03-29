import React, { useMemo } from 'react'
import { InvValueChangeStatusColor, ValueChangeStatus, ValueChangeStatusColor, ValueChangeStatusIcon } from '@state/status'
import styled, { css } from 'styled-components'
import { Text } from '@uikit'

const FlexText = styled(Text)<{ gap: string }>`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${({ gap }) => gap ?? '8px'};
	line-height: 14px;
	text-align: right;
`

const DesktopVerticalText = styled(Text)<{ mobileInline: boolean }>`
	display: flex;
	flex-direction: column;
	${({ theme, mobileInline }) =>
		mobileInline &&
		css`
			${theme.mediaQueries.invNav} {
				flex-direction: row;
				gap: 8px;
			}
		`}
`

interface Props {
	status?: ValueChangeStatus
	usdDisplay?: React.ReactNode
	censorableUsdDisplay?: React.ReactNode
	percDisplay?: React.ReactNode
	invertColors?: boolean
	mobileInline?: boolean
	gap?: string
	textAlign?: any
	usdFontSize?: string
	percFontSize?: string
	censorable?: boolean
}

export const PerfIndicator: React.FC<Props> = ({
	status = ValueChangeStatus.Neutral,
	usdDisplay,
	censorableUsdDisplay,
	percDisplay,
	invertColors,
	mobileInline = false,
	gap = '2px',
	textAlign = 'end',
	usdFontSize = '12px',
	percFontSize = '11px',
	censorable = false,
}) => {
	const color = useMemo(() => (invertColors ? InvValueChangeStatusColor : ValueChangeStatusColor)[status], [invertColors, status])
	return (
		<FlexText color={color} gap={gap}>
			{ValueChangeStatusIcon[status]}
			<DesktopVerticalText mobileInline={mobileInline}>
				<Text fontSize={usdFontSize} color={color} textAlign={textAlign} bold>
					{censorable ? censorableUsdDisplay : usdDisplay}
				</Text>
				<Text fontSize={percFontSize} color={color} textAlign={textAlign} italic>
					({percDisplay})
				</Text>
			</DesktopVerticalText>
		</FlexText>
	)
}
