import { useWeb3React } from '@web3-react/core'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useMemo } from 'react'
import { useInvolicaStore } from './store'
import { PositionConfig, PositionConfigMutators, PositionConfigSupplements, Token, UserTokenData } from './types'

export const useFetchPublicData = () => {
  const { slowRefresh } = useRefresh()
  const fetchPublicData = useInvolicaStore((state) => state.fetchPublicData)

  useEffect(() => {
    fetchPublicData()
  }, [fetchPublicData, slowRefresh])
}

export const useFetchUserData = () => {
  const { account } = useWeb3React()
  const { slowRefresh } = useRefresh()
  const { setActiveAccount, fetchUserData } = useInvolicaStore((state) => ({
    setActiveAccount: state.setActiveAccount,
    fetchUserData: state.fetchUserData,
  }))

  useEffect(() => {
    if (!account) return
    setActiveAccount(account)
    fetchUserData(account)
  }, [account, fetchUserData, setActiveAccount, slowRefresh])
}

export type WithDirty<T extends keyof PositionConfig> = { dirty: boolean } & Pick<PositionConfig, T>

export const useConfigSupplements = <S extends Array<keyof PositionConfigSupplements>>(
  supplements: S,
): Pick<PositionConfigSupplements, S[0]> => {
  return useInvolicaStore((state) => {
    const supps: Pick<PositionConfigSupplements, S[0]> = {} as any
    supplements.forEach((supp) => {
      supps[supp] = state.config[supp]
    })
    return supps
  })
}
export const useDirtyablePositionValue = <K extends keyof PositionConfig>(key: K): WithDirty<K> => {
  const positionVal = useInvolicaStore((state) => state.userData?.position?.[key])
  const configVal = useInvolicaStore((state) => state.config[key])

  console.log({
    positionVal,
    configVal
  })
  return useMemo(
    () =>
      ({
        [key]: configVal ?? positionVal,
        dirty: JSON.stringify(configVal) !== JSON.stringify(positionVal),
      } as WithDirty<K>),
    [key, positionVal, configVal],
  )
}

export const usePositionSetters = <M extends Array<keyof PositionConfigMutators>>(
  mutators: M,
): Pick<PositionConfigMutators, M[0]> => {
  return useInvolicaStore((state) => {
    const setters: Pick<PositionConfigMutators, M[0]> = {} as any
    mutators.forEach((mutator) => {
      setters[mutator] = state[mutator]
    })
    return setters
  })
}
export const useConfigurablePositionValue = <
  K extends keyof PositionConfig,
  M extends Array<keyof PositionConfigMutators>
>(
  key: K,
  mutators: M,
) => ({
  ...useDirtyablePositionValue(key),
  ...usePositionSetters(mutators),
})

export const usePositionTokenIn = () => ({ ...useDirtyablePositionValue('tokenIn') })
export const useConfigurableTokenIn = () => ({ ...useConfigurablePositionValue('tokenIn', ['setTokenIn']) })

export const usePositionOuts = () => ({ ...useDirtyablePositionValue('outs') })
export const useConfigurableOuts = () => ({
  ...useConfigurablePositionValue('outs', [
    'setOutsFromPreset',
    'addOut',
    'removeOut',
    'updateWeights',
    'updateOutMaxSlippage',
  ]),
})

export const usePositionAmountDCA = () => ({ ...useDirtyablePositionValue('amountDCA') })
export const useConfigurableAmountDCA = () => ({
  ...useConfigurablePositionValue('amountDCA', ['setAmountDCA']),
  ...useConfigSupplements(['amountDCAInvalidReason']),
})

export const usePositionIntervalDCA = () => ({ ...useDirtyablePositionValue('intervalDCA') })
export const useConfigurableIntervalDCA = () => ({
  ...useConfigurablePositionValue('intervalDCA', ['setWeeks', 'setDays', 'setHours']),
  ...useConfigSupplements(['weeks', 'days', 'hours']),
})

export const usePositionMaxGasPrice = () => ({ ...useDirtyablePositionValue('maxGasPrice') })
export const useConfigurableMaxGasPrice = () => ({ ...useConfigurablePositionValue('maxGasPrice', ['setMaxGasPrice']) })

export const useConfigurableDcasCount = () => ({
  ...useInvolicaStore((state) => ({ dcasCount: state.config.dcasCount })),
  ...usePositionSetters(['setDcasCount']),
})

export const useConfigFundingAmount = () => ({ ...useConfigSupplements(['fundingAmount']) })
export const useConfigurableFundingAmount = () => ({
  ...useInvolicaStore((state) => ({
    fundingAmount: state.config.fundingAmount,
    fundingInvalidReason: state.config.fundingInvalidReason,
  })),
  ...usePositionSetters(['setFundingAmount']),
})

export const useConfigurableGetStarted = () => ({
  ...useInvolicaStore((state) => ({ startIntro: state.config.startIntro })),
  ...usePositionSetters(['getStarted']),
})

// TOKEN DATA
export const useTokenPublicData = (token: string | undefined): { data: Token | undefined } => ({
  data: useInvolicaStore((state) => state?.tokens?.[token]),
})
export const useTokenUserData = (token: string | undefined): { userData: UserTokenData | undefined } => ({
  userData: useInvolicaStore((state) => state?.userData?.userTokensData?.[token]),
})
export const useTokenFullData = (
  token: string | undefined,
): { data: Token | undefined; userData: UserTokenData | undefined } => ({
  data: useInvolicaStore((state) => state?.tokens?.[token]),
  userData: useInvolicaStore((state) => state?.userData?.userTokensData?.[token]),
})

export const useNativeTokenPublicData = (): { nativeTokenData: Token | undefined } => ({
  nativeTokenData: useInvolicaStore((state) => state?.nativeToken),
})
export const useNativeTokenUserData = (): { nativeTokenUserData: UserTokenData | undefined } => ({
  nativeTokenUserData: useInvolicaStore((state) => state?.userData?.userNativeTokenData),
})
export const useNativeTokenFullData = (): { nativeTokenData: Token | undefined; nativeTokenUserData: UserTokenData | undefined } => ({
  nativeTokenData: useInvolicaStore((state) => state?.nativeToken),
  nativeTokenUserData: useInvolicaStore((state) => state?.userData?.userNativeTokenData),
})

export const usePositionTokenInWithData = () => {
  const { tokenIn, dirty } = usePositionTokenIn()
  const { data: tokenInData, userData: tokenInUserData } = useTokenFullData(tokenIn)
  return { tokenIn, dirty, tokenInData, tokenInUserData }
}
