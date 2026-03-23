"use client"

import { Button } from "@medusajs/ui"
import { Sun, Moon } from "@medusajs/icons"

export default function DarkModeButton() {
  return (
    <Button
      variant="primary"
      onClick={() => {
        const isDark = document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", isDark ? "dark" : "light")
      }}
    >
      <Sun className="w-5 h-5 hidden dark:block" />
      <Moon className="w-5 h-5 block dark:hidden" />
    </Button>
  )
}
