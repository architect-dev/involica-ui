import React, { useMemo } from 'react'
import { useDcaTxPriceRange, usePositionMaxGasPrice } from 'state/hooks'
import { SummitButton, Text, RowCenter, SummitPopUp, TextWithChangedButton, Column, RowBetween } from 'uikit'
import { bnDisplay, useShowHideModal } from 'utils'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'
import { Edit3 } from 'react-feather'
import MaxGasPriceSelector from 'views/Tutorial/steps/MaxGasPriceSelector'
import { MaxGasPriceOptions } from 'state/types'

export const EditMaxGasPriceModal: React.FC<{
  onDismiss?: () => void
}> = ({ onDismiss }) => {
  const minGasPrice: MaxGasPriceOptions = '100'
  const { minTxPrice, maxTxPrice, maxGasPrice } = useDcaTxPriceRange()
  const { maxGasPrice: currentMaxGasPrice } = usePositionMaxGasPrice(true)
  const dirty = useMemo(() => currentMaxGasPrice !== maxGasPrice, [currentMaxGasPrice, maxGasPrice])
  const maxTxPriceDisplay = useMemo(() => {
    if (maxTxPrice == null || maxTxPrice === '' || maxTxPrice === '0') return '-'
    return bnDisplay(maxTxPrice, 18, 4)
  }, [maxTxPrice])
  const minTxPriceDisplay = useMemo(() => {
    if (minTxPrice == null || minTxPrice === '' || minTxPrice === '0') return '-'
    return bnDisplay(minTxPrice, 18, 4)
  }, [minTxPrice])

  return (
    <ModalContentContainer alignItems="flex-start" minWidth="300px" maxWidth="350px" gap="12px">
      <Column alignItems="flex-start" gap="18px" width="100%">
        <Column alignItems="flex-start" width="100%">
          <RowBetween>
            <Text small italic>
              Min Gas Price (Hard Coded):
            </Text>
            <Text bold>{minGasPrice} gwei</Text>
          </RowBetween>
          <RowBetween>
            <Text small italic>
              Min DCA Tx Gas:
            </Text>
            <Text bold>{minTxPriceDisplay ?? '-'} FTM</Text>
          </RowBetween>
        </Column>

        <Text small italic>
          OPTIONAL: Select max DCA gas price:
          <br />
          (DCA execution will wait until gas price {'<='} max)
        </Text>

        <RowCenter>
          <MaxGasPriceSelector />
        </RowCenter>

        <Column alignItems="flex-start" width="100%">
          <RowBetween>
            <Text bold italic>
              Max Gas Price:
            </Text>
            <Text bold>{maxGasPrice} gwei</Text>
          </RowBetween>
          <RowBetween>
            <Text bold italic>
              Max DCA Tx Gas:
            </Text>
            <Text bold>{maxTxPriceDisplay ?? '-'} FTM</Text>
          </RowBetween>
        </Column>

        {dirty && (
          <>
            <RowCenter gap="6px">
              <Text bold color="warning">
                Max Gas Changed: <s>{currentMaxGasPrice}</s> {'>'}
              </Text>
              <Text color="text" bold>
                {maxGasPrice}
              </Text>
            </RowCenter>
            <RowCenter>
              <Text small italic textAlign="center">
                (Update your position for
                <br />
                this change to take effect)
              </Text>
            </RowCenter>
          </>
        )}
      </Column>

      <br />

      <RowCenter>
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}

export const EditMaxGasPriceButton: React.FC = () => {
  const [open, show, hide] = useShowHideModal()
  const { dirty, maxGasPrice } = usePositionMaxGasPrice()
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={
        <TextWithChangedButton onClick={show} bold italic changed={dirty} asterisk asteriskPosition="-6px 0px">
          {maxGasPrice} gwei
          <Edit3 size="14px" />
        </TextWithChangedButton>
      }
      popUpTitle="Edit Max Gas Price"
      popUpContent={<EditMaxGasPriceModal />}
    />
  )
}