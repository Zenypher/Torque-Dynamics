"use client"

import { Button } from "@headlessui/react"
import { Sun, Moon } from "@medusajs/icons"

export default function DarkModeButton() {
  return (
    <Button
      className="h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-bg duration-200 ease-in rounded-md flex items-center justify-center text-foreground"
      onClick={() => {
        const isDark = document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", isDark ? "dark" : "light")
      }}
      title="Toggle theme"
    >
      <Sun className="w-5 h-5 hidden dark:block" />
      <Moon className="w-5 h-5 block dark:hidden" />
    </Button>
  )
}
