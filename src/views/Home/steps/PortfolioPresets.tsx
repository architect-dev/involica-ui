import { getSymbol } from 'config/tokens'
import React, { useCallback, useState } from 'react'
import { PositionOut } from 'state/types'
import styled from 'styled-components'
import {
  RowBetween,
  RowStart,
  SummitButton,
  Text,
  TokenSymbolImage,
} from 'uikit'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { usePositionConfigState } from './introStore'
import { PositionSwapsOverviewOverride } from './PositionOverviewElements'

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  max-height: 90%;
  gap: 24px;
`

interface Preset {
  name: string
  outs: PositionOut[]
}

const TokensWrapper = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 2;
  width: 60px;
  padding: 0 12px;
`

const HiddenTokenSymbolImage = styled(TokenSymbolImage)<{ i: number }>`
  margin-left: -10px;
  z-index: ${({ i }) => -1 * i};
`

const presets: Array<Preset> = [
  {
    name: 'Maxi',
    outs: [
      {
        token: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
        weight: 65,
        maxSlippage: 1.5,
      },
      {
        token: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
        weight: 35,
        maxSlippage: 1.5,
      },
    ],
  },
  {
    name: 'Alts',
    outs: [
      {
        token: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
        weight: 33,
        maxSlippage: 1.5,
      },
      {
        token: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
        weight: 25,
        maxSlippage: 1.5,
      },
      {
        token: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
        weight: 19,
        maxSlippage: 1.5,
      },
      {
        token: '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3',
        weight: 13,
        maxSlippage: 1.5,
      },
      {
        token: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
        weight: 10,
        maxSlippage: 1.5,
      },
    ],
  },
]

const PresetButton: React.FC<{ preset: Preset }> = ({ preset }) => {
  const setOutsFromPreset = usePositionConfigState(
    (state) => state.setOutsFromPreset,
  )
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [setOpen])
  const hide = useCallback(() => setOpen(false), [setOpen])
  const handleUsePreset = useCallback(() => {
    setOutsFromPreset(preset.outs)
    setOpen(false)
  }, [setOutsFromPreset, preset])
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={
        <SummitButton onClick={show} width="120px" padding="0 12px 0 2px">
          <RowBetween>
            <TokensWrapper>
              {preset.outs.map((out, i) => (
                <HiddenTokenSymbolImage
                  key={out.token}
                  i={i}
                  symbol={getSymbol(out.token)}
                  width={24}
                  height={24}
                />
              ))}
            </TokensWrapper>
            {preset.name}
          </RowBetween>
        </SummitButton>
      }
      popUpContent={
        <ModalWrapper>
          <Text bold>Preset Position:</Text>
          <Text italic small textAlign="center" px="48px">
            The preset tokens and percentages can be edited after it has been
            imported.
          </Text>
          <PositionSwapsOverviewOverride outs={preset.outs} />
          <SummitButton
            activeText="Use this Preset"
            onClick={handleUsePreset}
          />
        </ModalWrapper>
      }
    />
  )
}

export const PortfolioPresets: React.FC = () => {
  return (
    <RowStart gap="12px">
      {presets.map((preset) => (
        <PresetButton key={preset.name} preset={preset} />
      ))}
    </RowStart>
  )
}
