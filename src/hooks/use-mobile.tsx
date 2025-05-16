
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Add the missing useMobileToggle hook
export function useMobileToggle() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isMobile = useIsMobile()
  
  // Close mobile sidebar when switching to desktop
  React.useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false)
    }
  }, [isMobile])
  
  return { mobileOpen, setMobileOpen }
}
