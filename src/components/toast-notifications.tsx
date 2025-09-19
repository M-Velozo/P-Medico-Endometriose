'use client'

import { useEffect, useState } from 'react'
import { toast as sonnerToast, Toaster } from 'sonner'

interface ToastNotificationsProps {
  children: React.ReactNode
}

export function ToastNotifications({ children }: ToastNotificationsProps) {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </>
  )
}

export function useToast() {
  const showToast = {
    success: (message: string) => {
      sonnerToast.success(message)
    },
    error: (message: string) => {
      sonnerToast.error(message)
    },
    info: (message: string) => {
      sonnerToast.info(message)
    },
    warning: (message: string) => {
      sonnerToast.warning(message)
    }
  }

  return showToast
}