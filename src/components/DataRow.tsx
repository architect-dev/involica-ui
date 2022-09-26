import React from 'react'
import { FlexProps } from 'styled-system'
import { BoxProps, RowBetween, Text } from 'uikit'

interface Props extends BoxProps, FlexProps {
  className?: string
  t: React.ReactNode
  v: React.ReactNode
}

export const DataRow: React.FC<Props> = React.memo(({ className, t, v, ...props }) => {
  return (
    <RowBetween className={className} {...props}>
      <Text small italic>
        {t}
      </Text>
      <Text bold>{v}</Text>
    </RowBetween>
  )
})
