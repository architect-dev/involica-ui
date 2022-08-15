import { useEffect, useState } from "react"

export interface gasAPI {
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
}

export async function getGasAPI() {
  const res = await fetch('https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=AZTJ36GVMVIV9FAJ5X4IW74MKIN33XV2VN', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  })
  const data = await res.json();
  const result: gasAPI = data?.result
  return result?.SafeGasPrice
}

export const useGasPrice = () => {
  const [gas, setGas] = useState<string | null>(null)
  useEffect(
    () => {
      const getGas = async() => {
        setGas(await getGasAPI())
      }
      getGas()
    },
    []
  )
  return gas
}