import OptionSelector from 'components/OptionSelector'
import { TokenButton } from 'components/TokenButton'
import React from 'react'
import { useUserPortfolioOutTokens } from 'state/uiHooks'
import { Column, RowStart, SummitButton, Text } from 'uikit'
import { ChartDataOption, useChartOptionsState } from './chartOptionsState'

export const ChartOptionsRow: React.FC = () => {
  const { dataOption, setDataOption, focusedToken, setFocusedToken } = useChartOptionsState()
  const userOutTokens = useUserPortfolioOutTokens()
  return (
    <Column gap="4px" alignItems="flex-start">
      <OptionSelector<ChartDataOption>
        buttonWidth={180}
        options={[
          { value: ChartDataOption.User, label: 'Your Portfolio' },
          { value: ChartDataOption.Involica, label: 'All of Involica' },
        ]}
        selected={dataOption}
        select={setDataOption}
      />
      <br/>
      <Text small italic>Filter by individual token performance:</Text>
      <RowStart gap="12px" flexWrap="wrap">
        {userOutTokens != null &&
          userOutTokens.length > 0 &&
          userOutTokens.map((token) => (
            <TokenButton
              key={token}
              disabled={token === focusedToken}
              token={token}
              noTokenString="Missing"
              onClick={() => {
                setFocusedToken(token)
              }}
            />
          ))}
        <SummitButton width='100px' onClick={() => setFocusedToken(null)} activeText="Reset" />
      </RowStart>
    </Column>
  )
}
