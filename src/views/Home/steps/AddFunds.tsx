import React, { useCallback, useMemo, useState } from 'react'
import { StepContentWrapper } from './styles'
import { SummitButton, Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol } from 'config/constants'
import { isNumber } from 'lodash'

export const AddFundsStep: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const [val, setVal] = useState<string>('')
  const [fullBalance, setFullBalance] = useState('10')
  const [invalidVal, setValInvalid] = useState(true)

  const validElevateVal = (testVal, stakedBal) => {
    return isNumber(parseFloat(testVal)) && parseFloat(testVal) > 0 && parseFloat(testVal) <= parseFloat(stakedBal)
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validElevateVal(e.currentTarget.value, fullBalance))
    },
    [setVal, setValInvalid, fullBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    setValInvalid(!validElevateVal(fullBalance, fullBalance))
  }, [fullBalance, setVal, setValInvalid])

  const collapsedContent = useMemo(
    () => <Text>Funds: <b>20.0 FTM ($6.32)</b></Text>,
    []
  )

  const expandedContent = useMemo(
    () => {
      return (
        <>
        <Text>Funds: <b>20.0 FTM ($6.32)</b></Text>
        <Text italic small>
            Deposit <b>{getNativeTokenSymbol()}</b> to cover the cost of your DCA transactions.
            <br />
            You can remove these funds at any point.
            <br />
            (20 FTM should be more than enough)
          </Text>
          <TokenInput
            symbol={getNativeTokenSymbol()}
            balanceText='WALLET'
            onChange={handleChange}
            onSelectMax={handleSelectMax}
            value={val}
            max={fullBalance}
            invalid={invalidVal && val !== ''}
          />
          <SummitButton disabled={invalidVal}>
            ADD FUNDS
          </SummitButton>
          </>
      )
    },
    [fullBalance, handleChange, handleSelectMax, val, invalidVal]
  )

  return <StepContentWrapper expanded={expanded}>
    { expanded ? expandedContent : collapsedContent}
  </StepContentWrapper>
}