export interface ModalTheme {
  background: string
}

export type Handler = (args?: any) => void

export interface InjectedProps {
  onDismiss?: Handler
}
