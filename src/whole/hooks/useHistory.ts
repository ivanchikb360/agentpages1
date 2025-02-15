import { useState, useCallback } from "react"

export function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<T[]>([initialState])

  const setState = useCallback(
    (action: T | ((prevState: T) => T)) => {
      const newState = typeof action === "function" ? (action as (prevState: T) => T)(history[index]) : action
      if (index < history.length - 1) {
        setHistory(history.slice(0, index + 1))
      }
      setHistory((prevHistory) => [...prevHistory, newState])
      setIndex((prevIndex) => prevIndex + 1)
    },
    [history, index],
  )

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1)
    }
  }, [index])

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex((prevIndex) => prevIndex + 1)
    }
  }, [index, history.length])

  const canUndo = index > 0
  const canRedo = index < history.length - 1

  return [history[index], setState, undo, redo, canUndo, canRedo] as const
}

