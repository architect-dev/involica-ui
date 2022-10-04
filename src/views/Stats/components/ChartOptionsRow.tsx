import React from 'react'
import OptionSelector from 'components/OptionSelector'
import { Row, RowBetween, RowStart, SummitButton, Text } from 'uikit'
import { ChartDataOption, useChartOptionsState } from './chartOptionsState'
import { X } from 'react-feather'
import TokenIconAndSymbol from 'components/TokenIconAndSymbol'

export const ChartOptionsRow: React.FC = () => {
  const { dataOption, setDataOption, focusedToken, setFocusedToken } = useChartOptionsState()
  console.log({
    focusedToken,
  })
  return (
    <Row gap="16px" alignItems="flex-start">
      <OptionSelector<ChartDataOption>
        buttonWidth={100}
        options={[
          { value: ChartDataOption.User, label: 'Portfolio' },
          { value: ChartDataOption.Involica, label: 'Involica' },
        ]}
        selected={dataOption}
        select={setDataOption}
      />
      <Text>Performance</Text>
      {dataOption === ChartDataOption.User && focusedToken != null && (
        <SummitButton onClick={() => setFocusedToken(null)} padding="0 8px 0 2px" width="100px">
          <RowBetween>
            <RowStart gap="4px">
              <TokenIconAndSymbol token={focusedToken} />
            </RowStart>
            <X size="16px" />
          </RowBetween>
        </SummitButton>
      )}
    </Row>
  )
}
