"use client"

import { Button } from "@headlessui/react"
import { Sun, Moon } from "@medusajs/icons"
import { useTheme } from "@/components/theme-provider"

export default function DarkModeButton() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const getIcon = () => {
    return theme === "dark" ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    )
  }

  const getTitle = () => {
    return `Switch to ${theme === "dark" ? "light" : "dark"} mode`
  }

  return (
    <Button
      className="h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-bg duration-200 ease-in rounded-md flex items-center justify-center text-foreground"
      onClick={toggleTheme}
      title={getTitle()}
    >
      {getIcon()}
    </Button>
  )
}
