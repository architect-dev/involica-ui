export const CHAIN_ID = import.meta.env.VITE_REACT_APP_CHAIN_ID!

export const ChainUsesPricingData = () => {
	if (CHAIN_ID === '97') return false
	if (CHAIN_ID === '250') return true
	if (CHAIN_ID === '57') return true
	if (CHAIN_ID === '137') return true
	return false
}

export const ChainIncludesBetaTokens = () => {
	return CHAIN_ID === '97'
}
