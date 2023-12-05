import { Fragment, JsonFragment } from '@ethersproject/abi'

export type Nullable<T> = T | null | undefined
export type ABI = string | ReadonlyArray<Fragment | JsonFragment | string>
