import BigNumber from "bignumber.js"
import { BN_ZERO } from "config/constants"
import { chunk } from "lodash"
import { Epoch } from "state/types"
import { retryableMulticall, abi, getSummitGlacierAddress } from "utils"

export const fetchUserEpochs = async (account: string) => {
    // const account = '0x1075d36082FaE788864637D082b86253c61a271E'
    const summitGlacierAddress = getSummitGlacierAddress()
    const interactingEpochsRes = await retryableMulticall(abi.summitGlacier, [{
        address: summitGlacierAddress,
        name: 'getUserInteractingEpochs',
        params: [account],
    }, {
        address: summitGlacierAddress,
        name: 'getCurrentEpoch'
    }, {
        address: summitGlacierAddress,
        name: 'userLifetimeWinnings',
        params: [account]
    }, {
        address: summitGlacierAddress,
        name: 'userLifetimeBonusWinnings',
        params: [account]
    }], 'fetchUserInteractingEpochs')

    if (interactingEpochsRes == null) return []

    const interactingEpochs = interactingEpochsRes[0][0].map((epochIndex) => epochIndex.toNumber())
    const currentEpochIndex = new BigNumber(interactingEpochsRes[1][0]._hex).toNumber()
    const lifetimeSummitWinnings = new BigNumber(interactingEpochsRes[2][0]._hex).toNumber()
    const lifetimeSummitBonuses = new BigNumber(interactingEpochsRes[3][0]._hex).toNumber()

    const epochCalls = interactingEpochs.map((epochIndex) => [{
        address: summitGlacierAddress,
        name: 'userLockedWinnings',
        params: [account, epochIndex],
    }, {
        address: summitGlacierAddress,
        name: 'hasEpochMatured',
        params: [epochIndex]
    }]).flat()
    
    const epochsRes = await retryableMulticall(abi.summitGlacier, epochCalls, "fetchUserEpochs")
    if (epochsRes == null) return []

    const chunkedRes = chunk(epochsRes, 2)
    const epochs = chunkedRes.map((resChunk, index): Epoch => ({
        index: interactingEpochs[index],
        frozenSummit: new BigNumber(resChunk[0].winnings._hex).minus(new BigNumber(resChunk[0].claimedWinnings._hex)),
        isThawed: resChunk[1][0]
    }))

    const { totalFrozenSummit, totalThawedSummit } = epochs.reduce((acc, epoch) => ({
        totalFrozenSummit: acc.totalFrozenSummit.plus(epoch.isThawed ? BN_ZERO : epoch.frozenSummit),
        totalThawedSummit: acc.totalThawedSummit.plus(epoch.isThawed ? epoch.frozenSummit : BN_ZERO),
    }), { totalFrozenSummit: BN_ZERO, totalThawedSummit: BN_ZERO })


    return {
        lifetimeSummitWinnings,
        lifetimeSummitBonuses,
        currentEpochIndex,
        epochs,
        totalFrozenSummit,
        totalThawedSummit,
    }
}