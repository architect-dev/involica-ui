import React from 'react'
import { Minus, TrendingDown, TrendingUp } from 'react-feather'

export enum PositionStatus {
  NoPosition = 'NoPosition',
  Active = 'Active',
  ActiveManualOnly = 'ActiveManualOnly',

  WarnPaused = 'Paused',
  WarnGasFunds = 'WarnGasFunds',

  ErrorNoDcaAmount = 'ErrorNoDcaAmount',
  ErrorGasFunds = 'ErrorGasFunds',
  ErrorInsufficientAllowance = 'ErrorInsufficientAllowance',
  ErrorInsufficientBalance = 'ErrorInsufficientBalance',
}
export type PositionStatusRecord<T> = Record<PositionStatus, T>

export const StatusString: PositionStatusRecord<React.ReactNode> = {
  [PositionStatus.Active]: 'Active',
  [PositionStatus.ActiveManualOnly]: 'Manual DCAs Only',

  [PositionStatus.WarnPaused]: 'Paused',
  [PositionStatus.WarnGasFunds]: 'Warning: Gas Funds Low',

  [PositionStatus.NoPosition]: 'No Position',
  [PositionStatus.ErrorNoDcaAmount]: 'No Amount to DCA Set',
  [PositionStatus.ErrorGasFunds]: 'Out of Gas Funds',
  [PositionStatus.ErrorInsufficientAllowance]: 'Insufficient Allowance',
  [PositionStatus.ErrorInsufficientBalance]: 'Insufficient Wallet Balance',
}

export enum PositionStatusType {
  Default,
  Active,
  Warning,
  Error,
}

export const StatusType: PositionStatusRecord<PositionStatusType> = {
  [PositionStatus.NoPosition]: PositionStatusType.Default,
  [PositionStatus.Active]: PositionStatusType.Active,
  [PositionStatus.ActiveManualOnly]: PositionStatusType.Active,

  [PositionStatus.WarnPaused]: PositionStatusType.Warning,
  [PositionStatus.WarnGasFunds]: PositionStatusType.Warning,

  [PositionStatus.ErrorNoDcaAmount]: PositionStatusType.Error,
  [PositionStatus.ErrorGasFunds]: PositionStatusType.Error,
  [PositionStatus.ErrorInsufficientAllowance]: PositionStatusType.Error,
  [PositionStatus.ErrorInsufficientBalance]: PositionStatusType.Error,
}

export const StatusColor: Record<PositionStatusType, string> = {
  [PositionStatusType.Default]: 'text',
  [PositionStatusType.Active]: 'success',
  [PositionStatusType.Warning]: 'warning',
  [PositionStatusType.Error]: 'failure',
}

// VALUE CHANGE IN TRADE
export enum ValueChangeStatus {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative',
}
export type ValueChangeStatusRecord<T> = Record<ValueChangeStatus, T>
export const ValueChangeStatusColor: ValueChangeStatusRecord<string> = {
  [ValueChangeStatus.Positive]: 'success',
  [ValueChangeStatus.Neutral]: 'text',
  [ValueChangeStatus.Negative]: 'failure',
}
export const InvValueChangeStatusColor: ValueChangeStatusRecord<string> = {
  [ValueChangeStatus.Positive]: 'failure',
  [ValueChangeStatus.Neutral]: 'text',
  [ValueChangeStatus.Negative]: 'success',
}
export const ValueChangeStatusIcon: ValueChangeStatusRecord<React.ReactNode> = {
  [ValueChangeStatus.Positive]: <TrendingUp size={16} />,
  [ValueChangeStatus.Neutral]: <Minus size="16" />,
  [ValueChangeStatus.Negative]: <TrendingDown size={16} />,
}
