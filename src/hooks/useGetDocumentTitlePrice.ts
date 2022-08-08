import { useEffect } from 'react'
import { useSummitPrice } from 'state/hooksNew'

const useGetDocumentTitlePrice = () => {
  const summitPriceUsd = useSummitPrice()

  const summitPriceUsdString =
    isNaN(summitPriceUsd?.toNumber())
      ? ''
      : ` - $${summitPriceUsd.toNumber().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`

  useEffect(() => {
    document.title = `S U M M I T${summitPriceUsdString}`
  }, [summitPriceUsdString])
}
export default useGetDocumentTitlePrice
