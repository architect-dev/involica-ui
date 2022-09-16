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
  return getTimeRemainingBreakdown(timeRemaining)
    .map((val, index) => (val === 0 && index < 2 ? '' : `${index < 3 ? val : `00${val}`.slice(-2)}${getTimeDenom(index)}`))
    .filter((val) => val !== '')
    .slice(0, 2)
    .join(' ')
}
export const getTimeRemainingBreakdown = (timeRemaining: number): number[] => {
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
    case 0: return 'd'
    case 1: return 'h'
    case 2: return 'm'
    default:
    case 3: return 's'
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
