import BigNumber from "bignumber.js"
import { BN_ZERO } from "config/constants"
import { retryableMulticall, abi, getEverestTokenAddress, getSummitTokenAddress } from "utils"

export const fetchEverestData = async (account: string | null) => {
    // const account = '0xCe71D1b2443c8a7207965d54dB0f74B29261fA00'
    const everestAddress = getEverestTokenAddress()
    const summitAddress = getSummitTokenAddress()
    const publicEverestCalls = [
        {
            address: everestAddress,
            name: 'totalSummitLocked'
        },
        {
            address: everestAddress,
            name: 'avgSummitLockDuration'
        },
        {
            address: everestAddress,
            name: 'totalSupply'
        },
    ]

    if (account == null) {
        const publicEverestRes = await retryableMulticall(
            abi.everestToken,
            publicEverestCalls,
            'fetchEverestData_public'
        )

        return {
            totalSummitLocked: new BigNumber(publicEverestRes[0][0]._hex),
            averageLockDuration: Math.round(new BigNumber(publicEverestRes[1][0]._hex).toNumber() / (24 * 3600)),
            everestSupply: new BigNumber(publicEverestRes[2][0]._hex),
        }            
    }

    const userEverestCalls = [
        {
            address: everestAddress,
            name: 'userEverestInfo',
            params: [account]
        },
    ]
    const allowanceCalls = [
        {
            address: summitAddress,
            name: 'balanceOf',
            params: [account]
        },
        {
            address: summitAddress,
            name: 'allowance',
            params: [account, everestAddress]
        },
        {
            address: everestAddress,
            name: 'balanceOf',
            params: [account]
        },
        {
            address: everestAddress,
            name: 'allowance',
            params: [account, everestAddress]
        },
    ]

    const [publicDataRes, userDataRes, allowancesRes] = await Promise.all([
        retryableMulticall(
            abi.everestToken,
            publicEverestCalls,
            'fetchEverestData'
        ),
        retryableMulticall(
            abi.everestToken,
            userEverestCalls,
            'fetchEverestData'
        ),
        retryableMulticall(
            abi.ERC20,
            allowanceCalls,
            'fetchEverestAllowances'
        )
    ])

    if (publicDataRes == null) return {
        totalSummitLocked: BN_ZERO,
        averageLockDuration: 0,
        everestSupply: BN_ZERO
    }

    const everestUserData = userDataRes == null ? {
        everestOwned: BN_ZERO,
        summitLocked: BN_ZERO,
        lockRelease: 0,
        lockDuration: 0,
        everestLockMult: 0,
    } : {
        everestOwned: new BigNumber(userDataRes[0].everestOwned._hex),
        summitLocked: new BigNumber(userDataRes[0].summitLocked._hex),
        lockRelease: new BigNumber(userDataRes[0].lockRelease._hex).toNumber(),
        lockDuration: Math.round(new BigNumber(userDataRes[0].lockDuration._hex).toNumber() / (24 * 3600)),
        everestLockMult: new BigNumber(userDataRes[0].everestLockMultiplier._hex).toNumber(),
    }

    const allowances = allowancesRes == null ? {
        summitBalance: BN_ZERO,
        summitAllowance: BN_ZERO,
        everestBalance: BN_ZERO,
        everestAllowance: BN_ZERO,
    } : {
        summitBalance: new BigNumber(allowancesRes[0][0]._hex),
        summitAllowance: new BigNumber(allowancesRes[1][0]._hex),
        everestBalance: new BigNumber(allowancesRes[2][0]._hex),
        everestAllowance: new BigNumber(allowancesRes[3][0]._hex),
    }

    return {
        totalSummitLocked: new BigNumber(publicDataRes[0][0]._hex),
        averageLockDuration: Math.round(new BigNumber(publicDataRes[1][0]._hex).toNumber() / (24 * 3600)),
        everestSupply: new BigNumber(publicDataRes[2][0]._hex),
        userData: {
            ...everestUserData,
            ...allowances,
        }
    }
}