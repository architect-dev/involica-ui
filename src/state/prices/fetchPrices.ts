import { fetchPricesV0 } from "./fetchPricesV0"
import { fetchPricesV1 } from "./fetchPricesV1"
import { fetchPricesV2 } from "./fetchPricesV2"

const pricingType = process.env.REACT_APP_PRICING_TYPE

export const fetchPrices = async () => {
    if (pricingType === '2') return fetchPricesV2()
    if (pricingType === '1') return fetchPricesV1()
    return fetchPricesV0()
}