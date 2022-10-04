import create from 'zustand'

export enum ChartDataOption {
  User,
  Involica,
}
interface ChartOptions {
  dataOption: ChartDataOption
  setDataOption: (dataOption: ChartDataOption) => void

  focusedToken: string | null
  setFocusedToken: (focusedToken: string | null) => void
}

export const useChartOptionsState = create<ChartOptions>()((set, get) => ({
  dataOption: ChartDataOption.User,
  setDataOption: (dataOption: ChartDataOption) =>
    set({ dataOption, focusedToken: dataOption === ChartDataOption.Involica ? null : get().focusedToken }),

  focusedToken: null,
  setFocusedToken: (focusedToken: string | null) => set({ focusedToken }),
}))
