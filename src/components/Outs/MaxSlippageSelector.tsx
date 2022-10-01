import NumericInput from 'components/Input/NumericInput'
import OptionSelector from 'components/OptionSelector'
import React, { useCallback, useState } from 'react'
import { usePositionOutConfigurableMaxSlippage } from 'state/hooks'
import { Column, RowBetween, RowCenter, RowEnd, Text } from 'uikit'

export const MaxSlippageSelector: React.FC<{ token: string }> = ({ token }) => {
  const { maxSlippage, dirty, current, updateMaxSlippage } = usePositionOutConfigurableMaxSlippage(token)

  const [value, setValue] = useState<string>([0.5, 1, 1.5].includes(maxSlippage) ? '' : maxSlippage.toString())
  const [invalidReason, setInvalidReason] = useState<string | null>(null)

  const handleSetValue = useCallback(
    (valRaw: React.FormEvent<HTMLInputElement>) => {
      const val = valRaw.currentTarget.value
      setValue(val)

      let reason: string | null = null
      if (val === '') reason = 'Slippage required'
      else if (isNaN(parseFloat(val))) reason = 'Not a number'
      else if (parseFloat(val) < 0.5) reason = 'Must be greater than 0.5%'
      else if (parseFloat(val) > 50) reason = 'Must be less than 50%'

      setInvalidReason(reason)

      if (reason == null) {
        updateMaxSlippage(val)
      }
    },
    [updateMaxSlippage],
  )

  const handleSelectPresetSlippage = useCallback(
    (slippage: string) => {
      setValue('')
      setInvalidReason(null)
      updateMaxSlippage(slippage)
    },
    [updateMaxSlippage],
  )

  return (
    <>
      <Column width="100%" gap="4px">
        <RowBetween>
          <OptionSelector<string>
            buttonWidth={60}
            options={[
              { value: '0.5', label: '0.5%' },
              { value: '1', label: '1%' },
              { value: '1.5', label: '1.5%' },
            ]}
            selected={`${maxSlippage}`}
            select={handleSelectPresetSlippage}
          />
          <NumericInput
            value={value}
            onChange={handleSetValue}
            endText="%"
            invalid={invalidReason != null}
            width="90px"
          />
        </RowBetween>
        {invalidReason && (
          <RowEnd>
            <Text small color="failure">
              {invalidReason}
            </Text>
          </RowEnd>
        )}
      </Column>
      {dirty && (
        <Column width="100%" gap="4px">
          <RowCenter gap="6px">
            <Text color="warning">
              Max Slippage Changed: <s>{current != null ? `${current}%` : '-'}</s> {'>'}
            </Text>
            <Text color="text" bold>
              {maxSlippage != null ? `${maxSlippage}%` : '-'}
            </Text>
          </RowCenter>
          <RowCenter>
            <Text small italic textAlign="center">
              (Update your position for
              <br />
              this change to take effect)
            </Text>
          </RowCenter>
        </Column>
      )}
    </>
  )
}
