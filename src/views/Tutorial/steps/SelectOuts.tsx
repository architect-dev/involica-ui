import React from 'react'
import { Text } from 'uikit'
import 'rc-slider/assets/index.css'
import { PortfolioPresets } from './PortfolioPresets'
import { OutsSelectionAndWeights } from 'components/Outs/OutsSelectionAndWeights'

export const SelectOuts: React.FC = () => {
  return (
    <>
      <Text small mb="-12px">
        Build a portfolio by adding tokens to swap into each DCA.
        <br />
        <br />
        <i>Select a portfolio preset:</i>
      </Text>
      <PortfolioPresets />
      <Text mb="-12px">
        <i>- OR -</i>
        <br />
        <br />
        <i>Customize your tokens and weights:</i>
      </Text>
      <OutsSelectionAndWeights intro />
    </>
  )
}
