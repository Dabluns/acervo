"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "acervoaki-theme"

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: "dark", toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark"
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  function toggle() {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.classList.toggle("dark", next === "dark")
      return next
    })
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
