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
    <>
      <Column gap="4px" alignItems="flex-start">
        <Text small italic>
          Select dataset:
        </Text>
        <OptionSelector<ChartDataOption>
          buttonWidth={120}
          options={[
            { value: ChartDataOption.User, label: 'Portfolio' },
            { value: ChartDataOption.Involica, label: 'Involica' },
          ]}
          selected={dataOption}
          select={setDataOption}
        />
      </Column>
      <Column gap="4px" alignItems="flex-start">
        <Text small italic>
          Filter portfolio by individual token performance:
        </Text>
        <RowStart gap="12px" flexWrap="wrap">
          {userOutTokens != null &&
            userOutTokens.length > 0 &&
            userOutTokens.map((token) => (
              <TokenButton
                key={token}
                disabled={dataOption === ChartDataOption.Involica || token === focusedToken}
                token={token}
                noTokenString="Missing"
                onClick={() => {
                  setFocusedToken(token)
                }}
              />
            ))}
          <SummitButton
            width="100px"
            disabled={dataOption === ChartDataOption.Involica}
            onClick={() => setFocusedToken(null)}
            activeText="Reset"
          />
        </RowStart>
      </Column>
    </>
  )
}
