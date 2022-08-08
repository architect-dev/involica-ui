import BigNumber from "bignumber.js"
import { BN_ZERO, getFarmTokens } from "config/constants"
import { getCartographerAddress, retryableMulticall, abi, groupByAndMap } from "utils"

export const fetchTokensUserData = async (account: string) => {
    const farmTokens = getFarmTokens()
    const cartographerAddress = getCartographerAddress()
    
    const erc20Calls = farmTokens.map((token) => [
        {
            address: token.tokenAddress,
            name: 'allowance',
            params: [account, getCartographerAddress()],
        },
        {
            address: token.tokenAddress,
            name: 'balanceOf',
            params: [account],
        }
    ]).flat()

    const erc20Res = await retryableMulticall(abi.ERC20, erc20Calls, 'fetchTokensUserData_ERC20')

    const cartCalls = farmTokens.map((token) => [
        {
            address: cartographerAddress,
            name: 'userTokenStakedAmount',
            params: [account, token.tokenAddress]
        },
        {
            address: cartographerAddress,
            name: 'tokenLastWithdrawTimestampForBonus',
            params: [account, token.tokenAddress]
        },
        {
            address: cartographerAddress,
            name: 'bonusBP',
            params: [account, token.tokenAddress]
        },
        {
            address: cartographerAddress,
            name: 'tokenLastDepositTimestampForTax',
            params: [account, token.tokenAddress]
        },
        {
            address: cartographerAddress,
            name: 'taxBP',
            params: [account, token.tokenAddress]
        },
    ]).flat()
    const cartRes = await retryableMulticall(abi.cartographer, cartCalls, 'fetchTokensUserData_Cart')
    
    return groupByAndMap(
        farmTokens,
        (token) => token.symbol,
        (token, tokenIndex) => {
            const staked = cartRes != null ? new BigNumber(cartRes[tokenIndex * 5 + 0][0]._hex): BN_ZERO
            const anyStaked = staked.isGreaterThan(0)
            return {
                staked,
                bonusResetTimestamp: cartRes != null ? cartRes[tokenIndex * 5 + 1][0].toNumber() : 0,
                bonusBP: cartRes != null && anyStaked ? cartRes[tokenIndex * 5 + 2][0] : 0,
                taxResetTimestamp: cartRes != null ? cartRes[tokenIndex * 5 + 3][0].toNumber() : 0,
                taxBP: cartRes != null ? cartRes[tokenIndex * 5 + 4][0] : 0,
                farmAllowance: erc20Res != null ? new BigNumber(erc20Res[tokenIndex * 2 + 0][0]._hex): BN_ZERO,
                walletBalance: erc20Res != null ? new BigNumber(erc20Res[tokenIndex * 2 + 1][0]._hex): BN_ZERO,
            }
        },
    )
}