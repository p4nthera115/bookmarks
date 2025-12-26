"use client"

import { useEffect, useState, useRef } from "react"

interface LoadingScreenProps {
  progress: number
  onLoaded: () => void
}

export default function LoadingScreen({
  progress,
  onLoaded,
}: LoadingScreenProps) {
  // Smoothly animate the displayed progress
  const [displayProgress, setDisplayProgress] = useState(0)
  const [phase, setPhase] = useState<
    "loading" | "filled" | "rotating" | "fading"
  >("loading")
  const animationRef = useRef<number | null>(null)
  const targetProgress = useRef(0)

  // Smoothly interpolate progress for visual feedback
  useEffect(() => {
    targetProgress.current = progress

    const animate = () => {
      setDisplayProgress((current) => {
        const diff = targetProgress.current - current
        // Ease towards target
        if (Math.abs(diff) < 0.5) {
          return targetProgress.current
        }
        return current + diff * 0.1
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [progress])

  // Handle phase transitions after loading completes
  useEffect(() => {
    if (progress >= 100 && phase === "loading") {
      // Phase 1: All bars fill up (brief pause to ensure all are visible)
      const filledTimeout = setTimeout(() => {
        setPhase("filled")
      }, 300)

      return () => clearTimeout(filledTimeout)
    }
  }, [progress, phase])

  useEffect(() => {
    if (phase === "filled") {
      // Phase 2: Bars rotate
      const rotateTimeout = setTimeout(() => {
        setPhase("rotating")
      }, 400)

      return () => clearTimeout(rotateTimeout)
    }
  }, [phase])

  useEffect(() => {
    if (phase === "rotating") {
      // Phase 3: Fade out after rotation completes
      const fadeTimeout = setTimeout(() => {
        setPhase("fading")
      }, 600)

      return () => clearTimeout(fadeTimeout)
    }
  }, [phase])

  useEffect(() => {
    if (phase === "fading") {
      // Finally trigger the onLoaded callback after fade starts
      const loadedTimeout = setTimeout(() => {
        onLoaded()
      }, 700)

      return () => clearTimeout(loadedTimeout)
    }
  }, [phase, onLoaded])

  const activeDivCount =
    phase === "loading" ? Math.floor((displayProgress / 100) * 11) : 11 // All bars filled once loading phase is complete

  const shouldRotate = phase === "rotating" || phase === "fading"
  const shouldFade = phase === "fading"

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 flex-row gap-[17px] ${
        shouldFade ? "opacity-0 pointer-events-none" : "opacity-100"
      } transition-opacity duration-700`}
    >
      {[...Array(11)].map((_, index) => (
        <div
          key={index}
          className="h-10 w-[1px] bg-black"
          style={{
            opacity: index < activeDivCount ? 1 : 0.1,
            rotate: shouldRotate ? "50deg" : "0deg",
            // transition: "opacity 0.3s ease-out, rotate 0.4s ease-out",
            transition: "opacity 1s ease-out, rotate 0.4s ease-out 0.5s",
          }}
        />
      ))}
    </div>
  )
}
