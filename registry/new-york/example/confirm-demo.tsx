"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { confirm } from "@/components/ui/confirm"

export default function ConfirmDemo() {
  const triggerSimple = () => {
    confirm({
      title: "Account Update",
      body: "Your profile has been saved successfully.",
      icon: "info",
      confirmText: "Great",
    })
  }

  const triggerStack = () => {
    confirm({
      title: "First Alert",
      body: "This is the first layer of the stack.",
      icon: "info",
    })
    setTimeout(() => {
      confirm({
        title: "Second Alert",
        body: "Look! I pushed the previous one back.",
        icon: "warning",
      })
    }, 200)
    setTimeout(() => {
      confirm({
        title: "Danger Zone",
        body: "Now we have a complete stack of confirmations.",
        icon: "danger",
        confirmText: "I understand",
      })
    }, 400)
  }

  const triggerAsync = () => {
    confirm({
      title: "Syncing Data",
      body: "This will start a background sync that takes about 2 seconds.",
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return true
      },
    })
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button onClick={triggerSimple} variant="outline" className="h-11 px-6 shadow-sm">
        Simple Alert
      </Button>
      <Button onClick={triggerStack} variant="secondary" className="h-11 px-6 shadow-sm">
        Trigger Stack (3)
      </Button>
      <Button onClick={triggerAsync} className="h-11 px-6 shadow-md shadow-primary/20">
        Async Lifecycle
      </Button>
    </div>
  )
}
