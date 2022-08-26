import { useInvolicaStore } from "./store"

export const useDebugActions = () => {
  return useInvolicaStore((state) => ({
    hydrateConfig: state.hydrateConfig,
    resetConfig: state.resetConfig,
  }))
}