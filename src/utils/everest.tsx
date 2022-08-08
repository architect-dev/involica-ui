import React from 'react'
import BigNumber from "bignumber.js"
import memoize from "fast-memoize"
import { lockDurationText } from "./timestamp"


export const minLockMult = 1000
export const inflectionLockMult = 10000
export const maxLockMult = 25000

export const minLockDuration = 7
export const inflectionLockDuration = 30
export const maxLockDuration = 365

export const sliderPoints = [
    7, 14, 21, 30, 60, 90, 180, 270, 365
]

export const lockDurationMultBP = (lockDuration: number): number => {
    if (lockDuration <= inflectionLockDuration) {
        return (((lockDuration - minLockDuration) / (inflectionLockDuration - minLockDuration)) * (inflectionLockMult - minLockMult)) + minLockMult
    }
    return (((lockDuration - inflectionLockDuration) / (maxLockDuration - inflectionLockDuration)) * (maxLockMult - inflectionLockMult)) + inflectionLockMult
}

export const lockDurationSliderMarksMemoizable = (minLockDur = 0, userLockDuration?: number) => {
    const markLegend = (duration) => {
        const multBP = lockDurationMultBP(duration)
        const durationText = lockDurationText(duration)
        return {
            style: {
                opacity: (duration < userLockDuration || duration < minLockDur) ? 0.5 : 1,
                fontWeight: (userLockDuration == null && duration === 30) || (duration === userLockDuration) ? '700' : '400'
            },
            label: <>
                <p className='slider-mark-text lock-mult-dur'>{durationText}</p>
                <p className='slider-mark-text lock-mult'>{(multBP / 10000).toFixed(2)}x</p>
            </>
        }
    }

    const durationPoints = sliderPoints.map((duration, index) => ({
        legend: markLegend(duration),
        mark: index * (100 / (sliderPoints.length - 1)),
    }))

    const marks = {}
    durationPoints.forEach((point) => {
        marks[point.mark] = point.legend
    })

    return marks
}

export const lockDurationSliderMarks = memoize(lockDurationSliderMarksMemoizable)

export const getLockDurationPerc = (days: number | null) => {
    if (days == null) return null
    const maxIndex = sliderPoints.findIndex((point) => point >= days)
    const minIndex = Math.max(maxIndex - 1, 0)
    const minDays = sliderPoints[minIndex]
    const maxDays = sliderPoints[maxIndex]
    return (((days - minDays) / (maxDays - minDays)) + minIndex) * (100 / (sliderPoints.length - 1))
}

export const sliderPercLockDuration = (markPerc: number): number => {
    return sliderPoints[Math.round(markPerc / (100 / (sliderPoints.length - 1)))]
}

export const lockDurationSliderPerc = (lockDuration: number): number => {
    const index = sliderPoints.indexOf(lockDuration)
    return (index >= 0 ? index : 3) * (100 / (sliderPoints.length - 1))
}

export const getExpectedEverestAward = (summitAmount: BigNumber | null, lockDuration: number | null): BigNumber | null => {
    if (summitAmount == null || lockDuration == null) return null
    const lockDurationMultiplier = lockDurationMultBP(lockDuration)
    return summitAmount.times(lockDurationMultiplier).div(10000)
}

export const getAdditionalEverestAwardForLockDurationIncrease = (summitAmount: BigNumber, lockDuration: number, everestOwned: BigNumber): BigNumber => {
    const lockDurationMultiplier = lockDurationMultBP(lockDuration)
    return summitAmount.times(lockDurationMultiplier).div(10000).minus(everestOwned)
}