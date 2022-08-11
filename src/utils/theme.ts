export const getChainLinearGradient = (chain) => {
  if (chain === 250) return ['#4bb5f9', '#0d4eae']
  if (chain === 137) return ['#945DF0', '#7936EB']
  return ['orange']
}
export const getChainSolidColor = (chain) => {
  if (chain === 250) return '#3098f2'
  if (chain === 137) return '#8247E5'
  return 'orange'
}