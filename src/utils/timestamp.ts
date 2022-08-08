export const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000)
}
export const getIsRolloverAvailable = (current: number, roundEnd: number): boolean => {
  return current >= roundEnd
}
export const getTimestampDiff = (a: number, b: number): number => {
  return a > b ? 0 : b - a
}
export const getTimeRemainingText = (timeRemaining: number): string => {
  return getRoundTimeRemainingBreakdown(timeRemaining)
    .map((val, index) => (val === 0 && index < 2 ? '' : `${`00${val}`.slice(-2)}${getTimeDenom(index)}`))
    .filter((val) => val !== '')
    .slice(0, 2)
    .join(' ')
}
export const getRoundTimeRemainingBreakdown = (timeRemaining: number): number[] => {
  return [
    Math.floor(timeRemaining / 86400),
    Math.floor((timeRemaining % 86400) / 3600),
    Math.floor((timeRemaining % 3600) / 60),
    timeRemaining % 60,
  ]
}
export const lockDurationText = (lockDur: number): string => {
  return lockDur === 365 ? '1Y' : lockDur > 30 ? `${Math.floor(lockDur / 30)}M` : `${lockDur}D`
}
export const lockDurationTextLong = (lockDur: number): string => {
  return lockDur === 365 ? '1 YEAR' : lockDur > 30 ? `${Math.floor(lockDur / 30)} MONTHS` : `${lockDur} DAYS`
}
export const stakeDurationToText = (dur: number): string => {
  const days = Math.floor(dur / (3600 * 24))
  const hours = Math.floor(Math.floor(dur % (3600 * 24)) / 3600)
  return `${days > 0 ? `${days}D ` : ''}${hours}H`
}
export const getTimeDenom = (index: number): string => {
  switch (index) {
    case 0: return 'D'
    case 1: return 'H'
    case 2: return 'M'
    default:
    case 3: return 'S'
  }
}
export const timestampToDate = (timestamp: number): string => {
  if (timestamp < 10000000) return '---'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' }).toUpperCase()
}
export const timestampToDateWithYear = (timestamp: number): string => {
  if (timestamp < 10000000) return '---'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}
