"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"
import {
  preloadTextures,
  getEssentialTextureUrls,
  getCardTextureUrls,
  LoadingProgress,
  isTextureCached,
} from "./textureLoader"
import { CardType } from "@/app/definitions"

interface LoadingContextType {
  progress: number
  isPreloaded: boolean
  preloadEssential: (cardArr: CardType[]) => Promise<void>
  preloadCard: (card: CardType) => Promise<void>
  isCardLoaded: (card: CardType) => boolean
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0)
  const [isPreloaded, setIsPreloaded] = useState(false)

  const preloadEssential = useCallback(async (cardArr: CardType[]) => {
    const urls = getEssentialTextureUrls(cardArr, 3)

    await preloadTextures(urls, (prog: LoadingProgress) => {
      setProgress(prog.progress)
    })

    setIsPreloaded(true)
  }, [])

  const preloadCard = useCallback(async (card: CardType) => {
    const urls = getCardTextureUrls(card)
    await preloadTextures(urls)
  }, [])

  const isCardLoaded = useCallback((card: CardType): boolean => {
    const urls = getCardTextureUrls(card)
    return urls.every((url) => isTextureCached(url))
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        progress,
        isPreloaded,
        preloadEssential,
        preloadCard,
        isCardLoaded,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
