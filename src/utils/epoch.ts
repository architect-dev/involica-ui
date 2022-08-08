

export const epochDuration = 3600 * 24 * 7
export const yieldLockEpochCount = 5

export const epochStartTimestamp = (epoch: number) => {
    return epoch * epochDuration
}
export const epochEndTimestamp = (epoch: number) => {
    return (epoch + 1) * epochDuration
}
export const epochThawTimestamp = (epoch: number) => {
    return epochStartTimestamp(epoch) + (yieldLockEpochCount * epochDuration)
}
export const getEpochTimestamps = (epoch: number) => ({
    beginTimestamp: epochStartTimestamp(epoch),
    closeTimestamp: epochEndTimestamp(epoch),
    thawTimestamp: epochThawTimestamp(epoch),
})