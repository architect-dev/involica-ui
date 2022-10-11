import { parseJSON } from "./helpers"

export enum LocalStorageKey {
    IS_DARK = 'IS_DARK',
}

interface LocalStorageProps {
    key: LocalStorageKey
    value?: any
    withChain?: boolean
    withAccount?: boolean
    readDefault?: any
}

export const writeToLocalStorage = (props: LocalStorageProps) => {
    localStorage.setItem(props.key, props.value)
}
export const readFromLocalStorage = (props: LocalStorageProps) => {
    return parseJSON(localStorage.getItem(props.key), props.readDefault || null)
}