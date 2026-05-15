"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { confirmDialog } from "@/components/micto/confirm-dialog"

export default function ConfirmDemo() {
  const triggerSimple = () => {
    void confirmDialog({
      title: "Account Update",
      body: "Your profile has been saved successfully.",
      icon: "info",
      confirmText: "Great",
    })
  }

  const triggerStack = () => {
    void confirmDialog({
      title: "First Alert",
      body: "This is the first layer of the stack.",
      icon: "info",
    })
    setTimeout(() => {
      void confirmDialog({
        title: "Second Alert",
        body: "Look! I pushed the previous one back.",
        icon: "warning",
      })
    }, 200)
    setTimeout(() => {
      void confirmDialog({
        title: "Danger Zone",
        body: "Now we have a complete stack of confirmations.",
        icon: "danger",
        confirmText: "I understand",
      })
    }, 400)
  }

  const triggerAsync = () => {
    void confirmDialog({
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
      <Button onClick={triggerSimple} variant="outline" className="h-11 px-6">
        Simple Alert
      </Button>
      <Button onClick={triggerStack} variant="secondary" className="h-11 px-6">
        Trigger Stack (3)
      </Button>
      <Button onClick={triggerAsync} className="h-11 px-6">
        Async Lifecycle
      </Button>
    </div>
  )
}

