import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const spookyswapClient = new ApolloClient({
	uri: 'https://api.fura.org/subgraphs/name/spookyswap',
	cache: new InMemoryCache(),
})
export const involicaClient = new ApolloClient({
	uri: 'https://api.thegraph.com/subgraphs/name/architect-dev/involica',
	cache: new InMemoryCache(),
})

export interface InvolicaStats {
	totalUserCount: number
	totalDcasCount: number
	totalManualDcasCount: number
	totalInvolicaTxFeeUsd: number
	totalTradeAmountUsd: number

	inTokens: string[]
	inAmounts: number[]

	outTokens: string[]
	outAmounts: number[]
}
export const transformInvolicaStats = (involicaStats: any): InvolicaStats => {
	return {
		totalUserCount: involicaStats.totalUserCount,
		totalDcasCount: involicaStats.totalDcasCount,
		totalManualDcasCount: involicaStats.totalManualDcasCount,
		totalInvolicaTxFeeUsd: parseFloat(involicaStats.totalInvolicaTxFeeUsd),
		totalTradeAmountUsd: parseFloat(involicaStats.totalTradeAmountUsd),

		inTokens: involicaStats.inTokens,
		inAmounts: involicaStats.inAmounts.map(parseFloat),

		outTokens: involicaStats.outTokens,
		outAmounts: involicaStats.outAmounts.map(parseFloat),
	}
}

export interface InsTokensAmountsPrices {
	outTokens: string[]
	outAmounts: number[]
	outPrices: number[]
}
export interface TimestampOutsTokensAmountsPrices {
	timestamp: number

	outTokens: string[]
	outAmounts: number[]
	outPrices: number[]
}
export interface PortfolioTokensPrices {
	portfolioInTokens: string[]
	portfolioInAmounts: number[]
	portfolioOutTokens: string[]
	portfolioOutAmounts: number[]
}
export interface InvolicaDCA extends TimestampOutsTokensAmountsPrices {
	txHash: string

	user: string
	recipient: string
	involicaTxFeeUsd: number
	manualExecution: boolean

	inToken: string
	inAmount: number
	inPrice: number

	dcasCount: number
	manualDcasCount: number
	totalInvolicaTxFeeUsd: number

	portfolioInTokens: string[]
	portfolioInAmounts: number[]
	portfolioOutTokens: string[]
	portfolioOutAmounts: number[]
}
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const transformInvolicaDCA = ({ id, timestamp, __typename, ...dca }: any) => {
	return {
		...dca,

		txHash: id,
		timestamp: parseInt(timestamp),
		involicaTxFeeUsd: parseFloat(dca.involicaTxFeeUsd),
		totalInvolicaTxFeeUsd: parseFloat(dca.totalInvolicaTxFeeUsd),

		inAmount: parseFloat(dca.inAmount),
		inPrice: parseFloat(dca.inPrice),

		outAmounts: dca.outAmounts.map(parseFloat),
		outPrices: dca.outPrices.map(parseFloat),

		portfolioInAmounts: dca.portfolioInAmounts.map(parseFloat),
		portfolioOutAmounts: dca.portfolioOutAmounts.map(parseFloat),
	} as InvolicaDCA
}

export interface InvolicaSnapshot extends InsTokensAmountsPrices, TimestampOutsTokensAmountsPrices {
	dcasCount: number
}
export const transformInvolicaSnapshot = (snapshot: any) => {
	return {
		timestamp: parseInt(snapshot.id),
		dcasCount: snapshot.dcasCount,

		outTokens: snapshot.outTokens,
		outAmounts: snapshot.outAmounts.map(parseFloat),
		outPrices: [],
	} as InvolicaSnapshot
}

export const BLOCK_PRICES = gql`
	query pricesCurrent($tokens: [Bytes]!, $blockNum: Int!) {
		bundle(id: "1", block: { number: $blockNum }) {
			ethPrice
		}
		tokens(where: { id_in: $tokens }, block: { number: $blockNum }) {
			id
			derivedETH
		}
	}
`

export const DAY_TOKEN_DATA = gql`
	query pricesCurrent($tokens: [Bytes]!, $timestamp: Int!) {
		tokenDayDatas(orderBy: date, orderDirection: asc, where: { date_gte: $timestamp, token_in: $tokens }, first: 1000) {
			priceUSD
			date
			id
		}
	}
`

export const INVOLICA_STATS_DATA = gql`
	query InvolicaStatsData {
		involica(id: "1") {
			id
			inAmounts
			outAmounts
			inTokens
			outTokens
			totalUserCount
			totalDcasCount
			totalInvolicaTxFeeUsd
			totalManualDcasCount
			totalTradeAmountUsd
		}
	}
`

export const SNAPSHOTS_DATA = gql`
	query SnapshotsData {
		involicaSnapshots(first: 1000) {
			id
			dcasCount
			inTokens
			inAmounts
			outTokens
			outAmounts
		}
	}
`

export const USER_STATS_DATA = gql`
	query UserStatsData($user: Bytes!) {
		dcas(where: { user: $user }, orderBy: timestamp, orderDirection: asc) {
			id
			user
			inAmount
			inToken
			inPrice
			involicaTxFeeUsd
			manualDcasCount
			manualExecution
			outAmounts
			outTokens
			outPrices
			portfolioInAmounts
			portfolioInTokens
			portfolioOutAmounts
			portfolioOutTokens
			recipient
			timestamp
			totalInvolicaTxFeeUsd
			dcasCount
		}
	}
`
