import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import LoadingScreen from "./LoadingScreen"
import ActiveUi from "./ActiveUi"
import { Dispatch, SetStateAction } from "react"
import { CardType } from "@/app/definitions"

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
  return (
    <div className="h-full w-full">
      <ActiveUi
        active={active}
        setActive={setActive}
        cardArr={cardArr}
        setCardArr={setCardArr}
        flipCard={flipCard}
      />
      {!isLoaded && <LoadingScreen onLoaded={() => setIsLoaded(true)} />}

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
    </div>
  )
}
