import React from 'react'
import { FlexProps } from 'styled-system'
import { BoxProps, RowBetween, RowStart, Text } from 'uikit'
import { SummitTooltip } from 'uikit/widgets/Popup/SummitTooltip'

interface Props extends BoxProps, FlexProps {
  className?: string
  t: React.ReactNode
  v: React.ReactNode
  i?: React.ReactNode
}

export const DataRow: React.FC<Props> = React.memo(({ className, t, i, v, ...props }) => {
  return (
    <RowBetween className={className} {...props}>
      <RowStart gap="6px" flex='1'>
        <Text small italic>
          {t}
        </Text>
        {i != null && <SummitTooltip content={i} />}
      </RowStart>
      <Text bold>{v}</Text>
    </RowBetween>
  )
})
