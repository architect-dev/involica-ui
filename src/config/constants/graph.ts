import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'https://api.fura.org/subgraphs/name/spookyswap',
  cache: new InMemoryCache(),
})

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
