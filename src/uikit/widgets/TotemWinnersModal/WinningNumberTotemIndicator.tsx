import { Elevation, elevationUtils } from 'config/constants'
import React from 'react'
import ContributionBreakdown from 'views/ElevationFarms/components/ContributionBreakdown'

interface Props {
    elevation: Elevation
    winningNumberDrawn: number | null
}
const WinningNumberTotemIndicator: React.FC<Props> = ({ elevation, winningNumberDrawn }) => {
    const elevTotems = elevationUtils.totemsArray(elevation)
    const totemRangeSize = 100 / elevTotems.length
    const winningTotem = winningNumberDrawn == null ? null : Math.floor(winningNumberDrawn / totemRangeSize)
    const totemWinningRanges = elevTotems.map((totem, index) => ({
        totem: true,
        title: `${elevation}_${totem}_${(winningTotem != null && totem === winningTotem) ? 1 : 0}`,
        key: index,
        perc: totemRangeSize,
        val: `${index * totemRangeSize}-${((index + 1) * totemRangeSize) - 1}`,
    }))

    return (
        <ContributionBreakdown
            loaded
            breakingDownTitle='WIN RANGE'
            breakdownType='TOTEM'
            contributions={totemWinningRanges}
        />
    )
}

export default React.memo(WinningNumberTotemIndicator)
