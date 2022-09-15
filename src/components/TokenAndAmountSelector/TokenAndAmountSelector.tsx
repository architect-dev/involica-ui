import React, { useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Text } from 'uikit'
import { TokenSelectButton } from 'components/TokenSelect/TokenSelectButton'
import { AddressRecord } from 'state/types'
import { useTokenFullData } from 'state/hooks'
import { SelectorWrapperBase } from 'uikit/widgets/Selector/styles'
import { bn, bnDisplay } from 'utils'
import { pressableMixin } from 'uikit/util/styledMixins'
import { transparentize } from 'polished'
import { TokenIndicator } from 'components/TokenSelect/TokenIndicator'

const StyledInputWrapper = styled(SelectorWrapperBase)`
  position: relative;
  align-items: center;

  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  max-width: 320px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}

  ${({ isLocked }) =>
    isLocked &&
    css`
      filter: grayscale(1);
      opacity: 0.5;
    `}
`

const ThinRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 24px;
  width: 100%;
  padding: 0 16px;
  gap: 16px;
`
const BalanceRow = styled(ThinRow)`
  justify-content: space-between;
`
const InputRow = styled(ThinRow)`
  height: 52px;
  border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.text)};
  border-left-width: 0px;
  border-right-width: 0px;
  justify-content: space-between;
  padding: 0px 12px;
`

const InputWrapper = styled.div<{ changed?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  height: 28px;

  ${({ changed, theme }) =>
    changed &&
    css`
      :after {
        content: '*';
        color: ${theme.colors.warning};
        font-size: 14px;
        font-weight: bold;
        font-family: Courier Prime, monospace;
        position: absolute;
        top: -4px;
        right: -8px;
      }
    `}
`

export const StyledInput = styled.input<{ invalid?: boolean }>`
  width: 100%;
  background: none;
  border: 0;
  font-size: 20px;
  font-weight: bold;
  font-style: italic;
  height: 52px;
  line-height: 52px;
  padding-right: 30px;
  flex: 1;
  margin: 0;
  padding: 0;
  outline: none;
  text-align: right;
  letter-spacing: 1px;
  color: ${({ theme, invalid }) => (invalid ? theme.colors.failure : theme.colors.text)};
`

const TextButton = styled.div`
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  padding: 0px 8px;
  margin: 0px -8px;
  color: ${({ theme }) => theme.colors.text};

  ${pressableMixin};

  &:hover {
    font-weight: bold;
    text-decoration: underline;
  }
`

interface TokenInputProps {
  token: string | null
  setToken?: (token: string) => void
  value: string
  setValue: (val: string, max: string) => void

  disabledReasons?: AddressRecord<string>

  placeholder?: string
  disabled?: boolean
  isLocked?: boolean
  invalid?: boolean

  tokenChanged?: boolean
  amountChanged?: boolean

  tokenSelectDisabled?: boolean
}

const TokenAndAmountSelector: React.FC<TokenInputProps> = ({
  token,
  setToken,
  value,
  setValue,

  disabledReasons,

  placeholder = '0.0',
  disabled,
  isLocked,
  invalid,

  tokenChanged,
  amountChanged,

  tokenSelectDisabled,
}) => {
  const { data: tokenData, userData: tokenUserData } = useTokenFullData(token)

  const fullBalance = useMemo(() => bnDisplay(tokenUserData?.balance, tokenData?.decimals), [
    tokenData?.decimals,
    tokenUserData?.balance,
  ])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value, fullBalance)
    },
    [setValue, fullBalance],
  )

  const handleSelect10 = useCallback(() => {
    setValue(bn(fullBalance).div(10).toString(), fullBalance)
  }, [setValue, fullBalance])
  const handleSelect50 = useCallback(() => {
    setValue(bn(fullBalance).div(5).toString(), fullBalance)
  }, [setValue, fullBalance])
  const handleSelectMax = useCallback(() => {
    setValue(fullBalance, fullBalance)
  }, [setValue, fullBalance])

  return (
    <StyledInputWrapper disabled={disabled} isLocked={isLocked} invalid={invalid}>
      <ThinRow>
        <TextButton onClick={handleSelect10}>10%</TextButton>
        <TextButton onClick={handleSelect50}>50%</TextButton>
        <TextButton onClick={handleSelectMax}>MAX</TextButton>
      </ThinRow>
      <InputRow>
        {tokenSelectDisabled ? (
          <TokenIndicator token={token} />
        ) : (
          <TokenSelectButton
            token={token}
            setToken={setToken}
            noTokenString="select"
            disabledTokens={disabledReasons}
            modalVariant="tokenIn"
            changed={tokenChanged}
          />
        )}
        <InputWrapper changed={amountChanged}>
          <StyledInput
            disabled={disabled || isLocked}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            invalid={invalid}
          />
        </InputWrapper>
      </InputRow>
      <BalanceRow>
        <Text>Balance:</Text>
        <Text>{fullBalance != null ? parseFloat(fullBalance).toFixed(3) : '-'}</Text>
      </BalanceRow>
    </StyledInputWrapper>
  )
}

export default TokenAndAmountSelector
