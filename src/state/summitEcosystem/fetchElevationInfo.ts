import {
  getElevationHelperAddress,
  retryableMulticall,
  abi,
  groupByAndMap,
  getSubCartographerAddress,
  getSummitTrustedSeederModuleAddress,
} from 'utils/'
import BigNumber from 'bignumber.js'
import { Elevation, elevationUtils } from 'config/constants/types'
import { range } from 'lodash'

export const fetchElevationsData = async (elevation?: Elevation) => {
  const elevationHelperAddress = getElevationHelperAddress()
  const summitTrustedSeederModuleAddress = getSummitTrustedSeederModuleAddress()
  const elevations = elevation != null ? [elevation] : elevationUtils.elevationExpedition
  const calls = elevations.map((elev) => [
    {
      address: elevationHelperAddress,
      name: 'unlockTimestamp',
      params: [elevationUtils.toInt(elev)],
    },
    {
      address: elevationHelperAddress,
      name: 'roundEndTimestamp',
      params: [elevationUtils.toInt(elev)],
    },
    {
      address: elevationHelperAddress,
      name: 'roundNumber',
      params: [elevationUtils.toInt(elev)],
    },
  ])

  const res = await retryableMulticall(abi.elevationHelper, calls.flat(), 'fetchElevationsData_elevHelper')
  if (res == null) return null

  const roundNumbers = elevations.map((_, elevIndex) => {
    return new BigNumber(res[elevIndex * 3 + 2][0]._hex).toNumber()
  })




  const prevWinningsMultipliersCalls = []
  const elevRounds = []
  
  elevations.forEach((elev, elevIndex) => {
    if (elev === Elevation.EXPEDITION) return

    const maxRoundNumber = Math.max(roundNumbers[elevIndex] - 1, 0)
    const minRoundNumber = Math.max(maxRoundNumber - 5, 1)
    const rounds = range(maxRoundNumber, minRoundNumber - 1, -1)
    elevRounds.push(rounds)
    rounds.forEach((round) => prevWinningsMultipliersCalls.push({
      address: getSubCartographerAddress(elev),
      name: 'roundWinningsMult',
      params: [round],
    }))
  })

  const elevsWithHistory = []
  const historicalWinnersCalls = elevations
    .filter((_, elevIndex) => roundNumbers[elevIndex] > 0)
    .map((elev) => {
      elevsWithHistory.push(elev)
      return {
        address: elevationHelperAddress,
        name: 'historicalWinningTotems',
        params: [elevationUtils.toInt(elev)],
      }
    })

  // WINNING NUMBERS
  const winningNumbersCalls = elevations.map((elev, elevIndex) => ({
    address: summitTrustedSeederModuleAddress,
    name: 'getRandomNumber',
    params: [elevationUtils.toInt(elev), Math.max(0, roundNumbers[elevIndex] - 1)]
  }))

  const [prevWinningsMultipliersRes, historicalWinningTotems, winningNumbersRes] = await Promise.all([
    retryableMulticall(
      abi.cartographerElevation,
      prevWinningsMultipliersCalls,
      'fetchElevationsData_cartElev',
    ),
    retryableMulticall(
      abi.elevationHelper,
      historicalWinnersCalls,
      'fetchElevationsData_historicalWinners',
    ),
    retryableMulticall(
      abi.summitTrustedSeederModule,
      winningNumbersCalls,
      'fetchElevationsData_rngWinningNumbers',
    )
  ])

  const elevPrevWinningsMultipliers = []
  let cumRoundsCount = 0
  elevations.forEach((elev, index) => {
    if (elev === Elevation.EXPEDITION) return

    const rounds = elevRounds[index]
    const roundsCount = rounds.length
    if (prevWinningsMultipliersRes == null) {
      elevPrevWinningsMultipliers.push(rounds.map(() => elevationUtils.totemCount(elev)))
    } else {
      elevPrevWinningsMultipliers.push(
        prevWinningsMultipliersRes
          .slice(cumRoundsCount, cumRoundsCount + roundsCount)
          .map((mult) => new BigNumber(mult[0]._hex).dividedBy(new BigNumber(10).pow(12)).toNumber())
        )
    }
    cumRoundsCount += roundsCount
  })

  return groupByAndMap(
    elevations,
    (elev) => elev,
    (elev, elevIndex) => {
      const unlockTimestamp = new BigNumber(res[elevIndex * 3 + 0]).toNumber()

      const roundEndTimestamp = new BigNumber(res[elevIndex * 3 + 1]).toNumber()
      const roundNumber = new BigNumber(res[elevIndex * 3 + 2][0]._hex).toNumber()

      let totemWinAcc = []
      let prevWinners = []
      const historyIndex = elevsWithHistory.indexOf(elev)
      if (historyIndex > -1) {
        totemWinAcc = historicalWinningTotems[historyIndex][0].map((winAcc) => new BigNumber(winAcc._hex).toNumber())// res[index * 3 + 2][0].map((item) => new BigNumber(item._hex).toNumber())
        prevWinners = historicalWinningTotems[historyIndex][1].map((winningTotem) => new BigNumber(winningTotem._hex).toNumber())// res[index * 3 + 2][0].map((item) => new BigNumber(item._hex).toNumber())
      } else {
        totemWinAcc = []
        prevWinners = []
      }

      let prevWinningsMultipliers = []
      if (elev !== Elevation.EXPEDITION) {
        prevWinningsMultipliers = elevPrevWinningsMultipliers[elevIndex]
      }

      const winningTotem = elev === Elevation.OASIS ?
        0 :
        (roundNumber <= 1 || prevWinners.length === 0) ? null : prevWinners[0]

      const winningNumberDrawn = new BigNumber(winningNumbersRes[elevIndex][0]._hex).toNumber()
        
      return {
        unlockTimestamp,
        roundEndTimestamp,
        roundNumber,
        totemWinAcc,
        prevWinners,
        prevWinningsMultipliers,
        winningTotem,
        winningNumberDrawn,
      }
    },
  )
}

export const fetchDeityDivider = async () => {
  const elevationHelperAddress = getElevationHelperAddress()
  const calls = [
    {
      address: elevationHelperAddress,
      name: 'currentDeityDivider',
    },
  ]

  const res = await retryableMulticall(abi.elevationHelper, calls, 'fetchElevationHelperPublicInfo')
  if (res == null) return null
  const [expeditionDivider] = res
  return new BigNumber(expeditionDivider).toNumber()
}
