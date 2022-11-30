import React from 'react'
import { FlexProps } from 'styled-system'
import { SummitTooltip } from 'uikit/widgets/Popup/SummitTooltip'
import { BoxProps, RowBetween, RowStart } from './Box'
import { Text } from './Text'

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
