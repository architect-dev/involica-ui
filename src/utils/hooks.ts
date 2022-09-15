import { useState, useCallback } from "react"

export const useShowHideModal = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [setOpen])
  const hide = useCallback(() => setOpen(false), [setOpen])
  return [open, show, hide]
}