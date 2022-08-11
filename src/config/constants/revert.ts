export const revertReasonMap = {
  // Check Position
  'User doesnt have a position': 'User doesnt have a position',

  // Deposit Treasury
  'msg.value must be > 0': 'Must deposit more than 0 funds',

  // Withdraw Treasury
  '_amount must be > 0': 'Must withdraw more than 0 funds',
  'Bad withdraw': 'Attempted to withdraw more funds than owned',

  // Set Position
  'Treasury must not be 0': 'Cannot create position with 0 funds deposited',
  'DCA amount must be > 0': 'Amount to DCA must be > 0',
  'DCA interval must be > 60s': 'Position DCA interval must be > 30min',
  'No more than 6 out tokens': 'Cannot create position with more than 6 tokens',
  'Token is not allowed': 'Invalid token in position',
  'Approve for at least 1 DCA': 'Your approved amount will not cover a DCA',
  'Wallet balance for at least 1 DCA': 'Your wallet doesnt have enough funds to cover a DCA',
  'Same token both sides of pair': 'You cannot swap for your input token',
  'Pair is blacklisted': 'One of your swaps is blacklisted',
  'Invalid slippage': 'Invalid slippage amount',
  'Non zero weight': 'Token weight cannot be 0',
  'Invalid route': 'Swap route is invalid for one of your tokens',
  'Weights do not sum to 10000': 'Your position doesnt add up to 100%',

  // ReInit Position
  'Task already initialized': 'Your position is already initialized',

  // Execute DCA
  'Only GelatoOps or User can Execute DCA': 'You dont have permission to execute this DCA',
  'DCA not mature': 'DCA not mature yet',
  'AmountOut for swaps is invalid': 'AmountOut for swaps is invalid',
}

export const isInvolicaRevertReason = (reason: string) => {
  return revertReasonMap[reason] != null
}

export const getInvolicaRevertReason = (reason: string): string => {
  return revertReasonMap[reason] ?? reason
}