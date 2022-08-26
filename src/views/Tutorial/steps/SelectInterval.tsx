import React from 'react'
import { Text } from 'uikit'
import { IntervalSelector } from 'components/IntervalSelector'

export const SelectInterval: React.FC = () => {

  return (
    <>
      <Text small>
        Choose how often you want your DCA to execute.
        <br />
        Less time between DCAs reduces your exposure to volitility,
        <br />
        but costs more gas (still only pennies per transaction).
        <br />
      </Text>
      <IntervalSelector/>
    </>
  )
}
