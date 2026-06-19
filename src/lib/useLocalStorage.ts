'use client'

import { useState, useEffect } from 'react'

// SSR-safe localStorage hook: returns defaultValue on server, reads the persisted
// value after mount so hydration never mismatches.
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue)

  // After mount, read persisted value from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored) as T)
      }
    } catch {
      // Ignore parse errors — fall back to defaultValue
    }
  }, [key])

  const setAndPersist = (newValue: T) => {
    setValue(newValue)
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch {
      // Ignore storage errors (e.g. private browsing quota)
    }
  }

  return [value, setAndPersist]
}
