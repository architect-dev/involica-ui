import React, { useCallback, useMemo } from 'react'
import { ModalActions, SummitButton } from 'uikit'
import { Elevation, elevToPalette } from 'config/constants/types'
import { FarmInteractionType } from '../FarmCard/FarmInteractionTypeSelector'
import { useApprove } from 'hooks/useApprove'
import useElevate from 'hooks/useElevate'
import useStake from 'hooks/useStake'
import useWithdraw from 'hooks/useWithdraw'

interface FarmInteractionActionButtonProps {
  symbol: string
  uiElevation?: Elevation
  sourceElevation?: Elevation
  targetElevation?: Elevation
  farmInteractionType: FarmInteractionType
  decimals: number
  farmToken: string
  isApproved: boolean
  val: string
  invalidVal: boolean
  invalidElevationErr: boolean
  totem: number | null
  onDismiss?: () => void
}

const FarmInteractionActionButton: React.FC<FarmInteractionActionButtonProps> = ({
  symbol,
  uiElevation,
  sourceElevation,
  targetElevation,
  farmInteractionType,
  decimals,
  farmToken,
  isApproved,
  val,
  invalidVal,
  invalidElevationErr,
  totem,
  onDismiss,
}) => {  
  const { onApprove, pending: approvalPending } = useApprove(farmToken, symbol)
  const { onStake, pending: stakePending } = useStake()
  const { onWithdraw, pending: withdrawPending } = useWithdraw()
  const { onElevate, pending: elevatePending} = useElevate()

  const interactionTypeText = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return 'Deposit'
          return 'Approve'
        case FarmInteractionType.Elevate: return `Elevate`
        case FarmInteractionType.Withdraw: return `Withdraw`
        default: return ''
      }
    },
    [isApproved, farmInteractionType]
  )

  const uiPalette = elevToPalette(uiElevation)

  const actionDisabled = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return totem == null || invalidElevationErr || invalidVal || targetElevation == null
          return false
        case FarmInteractionType.Elevate: return invalidElevationErr || totem == null || invalidVal || sourceElevation == null || targetElevation == null
        case FarmInteractionType.Withdraw: return invalidVal || invalidElevationErr || sourceElevation == null
        default: return false
      }
    },
    [isApproved, farmInteractionType, invalidElevationErr, totem, invalidVal, targetElevation, sourceElevation]
  )
  
  const handleAction = useCallback(
    () => {
      if (actionDisabled) return
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) {
            onStake(
              symbol,
              farmToken,
              targetElevation,
              val,
              decimals,
              onDismiss
            )
            break
          }
          onApprove()
          break
        case FarmInteractionType.Elevate:
          onElevate(
            symbol,
            farmToken,
            sourceElevation,
            targetElevation,
            val,
            decimals,
            onDismiss
          )
          break
        case FarmInteractionType.Withdraw:
          onWithdraw(
            symbol,
            farmToken,
            sourceElevation,
            val,
            decimals,
            onDismiss
          )
          break
        default: break
      }
    },
    [onDismiss, isApproved, farmInteractionType, symbol, farmToken, targetElevation, sourceElevation, val, decimals, actionDisabled, onStake, onApprove, onWithdraw, onElevate]
  )

  return (
    <ModalActions>
      <SummitButton summitPalette={uiPalette} secondary insetColor='background' onClick={onDismiss}>
        CANCEL
      </SummitButton>
      <SummitButton
        summitPalette={uiPalette}
        disabled={actionDisabled}
        isLoading={approvalPending || stakePending || withdrawPending || elevatePending}
        onClick={handleAction}
      >
        {interactionTypeText.toUpperCase()}
      </SummitButton>
    </ModalActions>
  )
}

export default FarmInteractionActionButton
