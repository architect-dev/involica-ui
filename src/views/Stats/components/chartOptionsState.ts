import create from 'zustand'

export enum ChartDataOption {
  User,
  Involica,
}
interface ChartOptions {
  dataOption: ChartDataOption
  setDataOption: (dataOption: ChartDataOption) => void

  dcasCountChart: boolean
  setDcasCountChart: (dataOption: ChartDataOption, dcasCountChart: boolean) => void

  focusedToken: string | null
  setFocusedToken: (focusedToken: string | null) => void

  censored: boolean,
  toggleCensored: () => void
}

export const useChartOptionsState = create<ChartOptions>()((set, get) => ({
  dataOption: ChartDataOption.User,
  setDataOption: (dataOption: ChartDataOption) => set({ dataOption, focusedToken: null }),

  dcasCountChart: false,
  setDcasCountChart: (dataOption: ChartDataOption, dcasCountChart: boolean) =>
    set({ dataOption, dcasCountChart, focusedToken: null }),

  focusedToken: null,
  setFocusedToken: (focusedToken: string | null) => set({ focusedToken, dcasCountChart: false }),

  censored: false,
  toggleCensored: () => set({ censored: !get().censored }),
}))
