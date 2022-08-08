import { abi, getCartographerAddress, retryableMulticall } from 'utils'

export const fetchSummitEnabled = async () => {
  const res = await retryableMulticall(
    abi.cartographer,
    [
      {
        address: getCartographerAddress(),
        name: 'enabled',
      },
    ],
    'fetchSummitEnabled',
  )
  if (res == null) return null
  const [[summitEnabled]] = res

  return summitEnabled
}
