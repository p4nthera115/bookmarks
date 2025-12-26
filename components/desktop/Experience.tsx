"use client"

import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react"
import Card from "./Card"
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"
import { CardType } from "@/app/definitions"
import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import * as THREE from "three"

interface ExperienceProps {
  cardArr: CardType[]
  active: number | null
  setActive: Dispatch<SetStateAction<number | null>>
  isLoaded: boolean
}

export default function Experience({
  cardArr,
  active,
  setActive,
  isLoaded,
}: ExperienceProps) {
  const { scene } = useThree()
  const currentBottomColor = useRef(new THREE.Color("#cccccc"))
  const gradientCanvas = useRef(document.createElement("canvas"))
  const gradientTexture = useRef(
    new THREE.CanvasTexture(gradientCanvas.current)
  )
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null)
  const planeMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const targetOpacity = useRef(1)
  const opacityDelay = useRef(0)

  useMemo(() => {
    gradientCanvas.current.width = 256
    gradientCanvas.current.height = 256
    gradientTexture.current = new THREE.CanvasTexture(gradientCanvas.current)
    gradientTexture.current.minFilter = THREE.LinearFilter
    gradientTexture.current.magFilter = THREE.LinearFilter
    scene.background = gradientTexture.current
  }, [scene])

  useEffect(() => {
    targetOpacity.current = isLoaded && !active ? 0 : 1
    opacityDelay.current = 0
  }, [active, isLoaded])

  useFrame((state, delta) => {
    const targetIntensity = active !== null ? 3 : 2
    if (ambientLightRef.current) {
      easing.damp(
        ambientLightRef.current,
        "intensity",
        targetIntensity,
        0.3,
        delta
      )
    }

    const activeCard = cardArr.find((card) => card.id === active)
    const selectedVariant =
      activeCard && active !== null
        ? activeCard.colorVariations[activeCard.selectedVariantIndex]
        : null
    const targetBottomColor =
      active !== null && selectedVariant ? selectedVariant.bgColor : "#cccccc"

    easing.dampC(currentBottomColor.current, targetBottomColor, 0.5, delta)

    const ctx = gradientCanvas.current.getContext("2d")
    if (ctx) {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        gradientCanvas.current.height
      )
      gradient.addColorStop(0, "#cccccc")
      gradient.addColorStop(0.7, currentBottomColor.current.getStyle())

      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        0,
        gradientCanvas.current.width,
        gradientCanvas.current.height
      )
    }

    gradientTexture.current.needsUpdate = true

    opacityDelay.current += delta
    if (planeMaterialRef.current && opacityDelay.current >= 0.2) {
      easing.damp(
        planeMaterialRef.current,
        "opacity",
        targetOpacity.current,
        1.9,
        delta
      )
    }
  })

  return (
    <>
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
      />
      <ambientLight ref={ambientLightRef} intensity={0} />
      <directionalLight
        castShadow
        intensity={1}
        position={[10, 6, 6]}
        shadow-mapSize={[1028, 1028]}
      />

      <Environment
        environmentIntensity={1}
        preset={"city"}
        environmentRotation={active ? [Math.PI, -Math.PI / 2, 0] : [0, 0, 0]}
      />

      {cardArr.map((card, i) => (
        <Card
          card={card}
          key={card.id}
          id={card.id}
          cardPos={i - (cardArr.length - 1) / 2}
          active={active}
          setActive={setActive}
          isLoaded={isLoaded}
        />
      ))}

      {!active && (
        <>
          <mesh position={[0, -1.75 / 2 + 0.0001, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial
              ref={planeMaterialRef}
              color={"#e6e6e6"}
              transparent
              opacity={1}
            />
          </mesh>
          <ContactShadows
            position={[0, -1.75 / 2, 0]}
            scale={12}
            resolution={512}
            opacity={6}
            far={1}
          />
        </>
      )}
    </>
  )
}
