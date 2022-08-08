import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import FarmTypeSelector from './FarmTypeSelector'
import FarmActiveSelector from './FarmActiveSelector'

const FilterRowFlex = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const FarmFilterRow: React.FC = () => {
  return (
    <FilterRowFlex>
      <FarmTypeSelector />
      <FarmActiveSelector />
    </FilterRowFlex>
  )
}

export default React.memo(FarmFilterRow)
