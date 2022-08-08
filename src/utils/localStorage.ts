import { Elevation } from "config/constants"
import { CHAIN_ID } from "config/constants/networks"
import { parseJSON } from "./helpers"


export enum LocalStorageKey {
    IS_DARK = 'IS_DARK',
    ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT',
    EXPEDITION_DEITY = 'EXPEDITION_DEITY',
    EXPEDITION_FAITH = 'EXPEDITION_FAITH',
    EXPEDITION_ENTERED = 'EXPEDITION_ENTERED',
    FARM_APRS = 'FARM_APRS',
    AVG_STAKING_LOYALTY_DURATION = 'AVG_STAKING_LOYALTY_DURATION',
    PRICES_PER_TOKEN = 'PRICES_PER_TOKEN',
    SUMMIT_ENABLED = 'SUMMIT_ENABLED',
    EXPEDITION_APR = 'EXPEDITION_APR',
    FARM_TYPE = 'FARM_TYPE',

    // ELEVATION BASED KEYS
    TOTEM = 'TOTEM',
    MARKED_WINNING_ROUND = 'MARKED_WINNING_ROUND',
    TOTEM_SELECTION_ROUND = 'TOTEM_SELECTION_ROUND',
    ELEVATION_INFO = 'ELEVATION_INFO',
    WINNING_NUMBER_DRAWN = 'WINNING_NUMBER_DRAWN',
    WINNING_TOTEM = 'WINNING_TOTEM',
}

interface LocalStorageProps {
    key: LocalStorageKey
    value?: any
    elevation?: Elevation
    withChain?: boolean
    withAccount?: boolean
    readDefault?: any
}

export const getLocalStorageAccount = () => {
    return parseJSON(localStorage.getItem(LocalStorageKey.ACTIVE_ACCOUNT), null)
}

const getFullKey = ({ key, elevation = null, withChain = false, withAccount = false}: LocalStorageProps) => {
    return [
        withChain ? CHAIN_ID : null,
        withAccount ? getLocalStorageAccount() : null,
        elevation != null ? elevation : null,
        key
    ]
        .filter((keyComp) => keyComp != null)
        .join('/')
}
export const writeToLocalStorage = (props: LocalStorageProps) => {
    const fullKey = getFullKey(props)
    localStorage.setItem(fullKey, props.value)
}
export const readFromLocalStorage = (props: LocalStorageProps) => {
    const fullKey = getFullKey(props)
    return parseJSON(localStorage.getItem(fullKey), props.readDefault || null)
}