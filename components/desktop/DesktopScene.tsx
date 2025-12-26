import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import LoadingScreen from "./LoadingScreen"
import ActiveUi from "./ActiveUi"
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react"
import { CardType } from "@/app/definitions"
import {
  preloadTextures,
  getEssentialTextureUrls,
  LoadingProgress,
} from "@/lib/textureLoader"

interface DesktopSceneProps {
  cardArr: CardType[]
  setCardArr: Dispatch<SetStateAction<CardType[]>>
  active: number | null
  setActive: Dispatch<SetStateAction<number | null>>
  isLoaded: boolean
  setIsLoaded: Dispatch<SetStateAction<boolean>>
  flipCard: (cardId: number, isFlipped: boolean) => void
}

export default function DesktopScene({
  cardArr,
  setCardArr,
  active,
  setActive,
  isLoaded,
  setIsLoaded,
  flipCard,
}: DesktopSceneProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isPreloading, setIsPreloading] = useState(true)

  // Preload essential textures on mount
  useEffect(() => {
    const preload = async () => {
      const urls = getEssentialTextureUrls(cardArr, 9) // Preload first 5 cards
      await preloadTextures(urls, (progress: LoadingProgress) => {
        setLoadingProgress(progress.progress)
      })
      setIsPreloading(false)
    }
    preload()
  }, [cardArr])

  const handleLoaded = useCallback(() => {
    setIsLoaded(true)
  }, [setIsLoaded])

  return (
    <div className="h-full w-full">
      <ActiveUi
        active={active}
        setActive={setActive}
        cardArr={cardArr}
        setCardArr={setCardArr}
        flipCard={flipCard}
      />
      {!isLoaded && (
        <LoadingScreen progress={loadingProgress} onLoaded={handleLoaded} />
      )}

      {/* Only render Canvas after preloading is complete to avoid blocking */}
      {!isPreloading && (
        <Canvas
          className="fixed z-20"
          shadows
          flat
          dpr={[1, 1.5]}
          camera={{ position: [0, 2, 8], fov: 30, near: 1, far: 30 }}
        >
          <Experience
            cardArr={cardArr}
            active={active}
            setActive={setActive}
            isLoaded={isLoaded}
          />
        </Canvas>
      )}
    </div>
  )
}
