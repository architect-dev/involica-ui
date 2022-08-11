import { useWeb3React } from "@web3-react/core"
import useRefresh from "hooks/useRefresh"
import { useEffect } from "react"
import { useInvolicaStore } from "./zustand"

export const useFetchPublicData = () => {
  const { slowRefresh } = useRefresh()
  const fetchPublicData = useInvolicaStore((state) => state.fetchPublicData)

  useEffect(() => {
    fetchPublicData()
  }, [fetchPublicData, slowRefresh])
}

export const useFetchUserData = () => {
  const { account } = useWeb3React()
  const { slowRefresh } = useRefresh()
  const {setActiveAccount, fetchUserData} = useInvolicaStore((state) => ({
    setActiveAccount: state.setActiveAccount,
    fetchUserData: state.fetchUserData
  }))

  useEffect(() => {
    if (!account) return
    setActiveAccount(account)
    fetchUserData(account)
  }, [account, fetchUserData, setActiveAccount, slowRefresh])
}