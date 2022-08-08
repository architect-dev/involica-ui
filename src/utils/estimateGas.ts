import { Contract, Overrides } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { RevertReasonMap } from 'config/constants/types'

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param gasMarginPer10000 The gasMargin per 10000 (i.e. 10% -> 1000)
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const estimateGas = async (
    contract: Contract,
    methodName: string,
    methodArgs: any[],
    gasMarginPer10000: number,
) => {
    if (!contract[methodName]) {
        throw new Error(`Method ${methodName} doesn't exist on ${contract.address}`)
    }
    const rawGasEstimation = await contract.estimateGas[methodName](...methodArgs)
    // By convention, BigNumber values are multiplied by 1000 to avoid dealing with real numbers
    const gasEstimation = rawGasEstimation
        .mul(10000 + gasMarginPer10000)
        .div(10000)
    return gasEstimation
}


export class RevertError extends Error {
    constructor(msg) {
        super(msg)

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RevertError.prototype)
    }
}


export const extractRevertMsg = (err) => {
    const rawRevertMessage = err.data?.message?.split('execution reverted: ')[1] || err.message || 'Unknown Error'
    const mappedRevertMessage = RevertReasonMap[rawRevertMessage.split(' ').join('_')]
    return mappedRevertMessage != null ? mappedRevertMessage : rawRevertMessage
}

/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const callWithEstimateGas = async (
    contract: Contract,
    methodName: string,
    methodArgs: any[] = [],
    overrides: Overrides = {},
    gasMarginPer10000 = 1000,
): Promise<TransactionResponse> => {
    const gasEstimation = estimateGas(contract, methodName, methodArgs, gasMarginPer10000)
    try {
        const tx = await contract[methodName](...methodArgs, {
            gasLimit: gasEstimation,
            ...overrides,
        })
        await tx.wait()
        return tx
    } catch (err) {
        throw new RevertError(extractRevertMsg(err))
    }
}
