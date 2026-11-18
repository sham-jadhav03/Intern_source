import { useEffect } from "react"
import { create } from "zustand"
import { CURRENT_USER_ID } from "@/data/mock"

// Simulated presence: no networking, collaborators just drift online/offline on a timer.
const usePresenceStore = create<{ online: Record<string, boolean> }>(() => ({
  online: { u1: true, u2: true, u3: true, u5: true, u6: false, u7: true, u4: false, u8: true },
}))

export const useIsOnline = (userId: string) => usePresenceStore((s) => userId === CURRENT_USER_ID || !!s.online[userId])

export function useSimulatedPresence() {
  useEffect(() => {
    const id = setInterval(() => {
      usePresenceStore.setState((s) => {
        const ids = Object.keys(s.online).filter((k) => k !== CURRENT_USER_ID)
        const pick = ids[Math.floor(Math.random() * ids.length)]!
        return { online: { ...s.online, [pick]: !s.online[pick] } }
      })
    }, 8000)
    return () => clearInterval(id)
  }, [])
}

export const useOnlineMap = () => usePresenceStore((s) => s.online)
