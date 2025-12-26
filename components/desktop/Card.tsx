"use client"

import { useFrame } from "@react-three/fiber"
import {
  useRef,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"
import * as THREE from "three"
import { easing } from "maath"
import { Decal } from "@react-three/drei"
import { CardType } from "@/app/definitions"
import {
  getCachedTexture,
  getCachedHDR,
  loadTexture,
  loadHDR,
  isTextureCached,
} from "@/lib/textureLoader"

const createRoundedRectShape = (
  width: number,
  height: number,
  radius: number
): THREE.Shape => {
  const shape = new THREE.Shape()
  shape.moveTo(-width / 2, -height / 2 + radius)
  shape.lineTo(-width / 2, height / 2 - radius)
  shape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2 + radius,
    height / 2
  )
  shape.lineTo(width / 2 - radius, height / 2)
  shape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius)
  shape.lineTo(width / 2, -height / 2 + radius)
  shape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2 - radius,
    -height / 2
  )
  shape.lineTo(-width / 2 + radius, -height / 2)
  shape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2,
    -height / 2 + radius
  )
  return shape
}

interface CardProps {
  card: CardType
  id: number
  cardPos: number
  active: number | null
  setActive: Dispatch<SetStateAction<number | null>>
  isLoaded: boolean
}

interface CardTextures {
  frontIllustration: THREE.Texture | null
  backIllustration: THREE.Texture | null
  frontFoil: THREE.Texture | null
  backFoil: THREE.Texture | null
  frontNormal: THREE.Texture | null
  backNormal: THREE.Texture | null
}

const Card = ({
  card,
  id,
  cardPos,
  active,
  setActive,
  isLoaded,
}: CardProps) => {
  const [hover, setHover] = useState(false)
  const [texturesLoaded, setTexturesLoaded] = useState(false)
  const [textures, setTextures] = useState<CardTextures>({
    frontIllustration: null,
    backIllustration: null,
    frontFoil: null,
    backFoil: null,
    frontNormal: null,
    backNormal: null,
  })
  const [goldEnvMap, setGoldEnvMap] = useState<THREE.DataTexture | null>(null)
  const [silverEnvMap, setSilverEnvMap] = useState<THREE.DataTexture | null>(
    null
  )

  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const roundedRectShape = createRoundedRectShape(1.0, 1.75, 0.1)
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(roundedRectShape, {
        depth: 0.02,
        bevelEnabled: false,
      }),
    [roundedRectShape]
  )
  const planeGeometry = useMemo(() => {
    const shape = createRoundedRectShape(1.0, 1.75, 0.1)
    const geo = new THREE.ShapeGeometry(shape, 32)
    geo.computeVertexNormals()
    const uvs = geo.attributes.uv.array
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i] = (uvs[i] + 0.5) * (1.0 / 1.0)
      uvs[i + 1] = (uvs[i + 1] + 0.875) * (1.0 / 1.75)
    }
    geo.attributes.uv.needsUpdate = true
    return geo
  }, [])
  const initialPos = useMemo(
    () => new THREE.Vector3(cardPos * 0.4, 0, 0),
    [cardPos]
  )
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const selectedVariant = card.colorVariations[card.selectedVariantIndex]

  // Load textures lazily using our cached loader
  useEffect(() => {
    let mounted = true

    const loadCardTextures = async () => {
      const texturePaths = {
        frontIllustration: selectedVariant.illustration.front,
        backIllustration: selectedVariant.illustration.back,
        frontFoil: card.foil.front,
        backFoil: card.foil.back,
        frontNormal: card.normalMap.front,
        backNormal: card.normalMap.back,
      }

      const loadedTextures: CardTextures = {
        frontIllustration: null,
        backIllustration: null,
        frontFoil: null,
        backFoil: null,
        frontNormal: null,
        backNormal: null,
      }

      // Try to get cached textures first, then load if needed
      for (const [key, path] of Object.entries(texturePaths)) {
        if (path) {
          let texture = getCachedTexture(path)
          if (!texture) {
            try {
              texture = await loadTexture(path)
            } catch (e) {
              console.warn(`Failed to load texture: ${path}`, e)
            }
          }
          if (texture && mounted) {
            loadedTextures[key as keyof CardTextures] = texture
          }
        }
      }

      // Load HDR environment maps
      const goldPath = "/pretville_cinema_1k.hdr"
      const silverPath = "/st_peters_square_night_1k.hdr"

      let goldHdr = getCachedHDR(goldPath)
      if (!goldHdr) {
        try {
          goldHdr = await loadHDR(goldPath)
        } catch (e) {
          console.warn("Failed to load gold HDR", e)
        }
      }

      let silverHdr = getCachedHDR(silverPath)
      if (!silverHdr) {
        try {
          silverHdr = await loadHDR(silverPath)
        } catch (e) {
          console.warn("Failed to load silver HDR", e)
        }
      }

      if (mounted) {
        setTextures(loadedTextures)
        setGoldEnvMap(goldHdr)
        setSilverEnvMap(silverHdr)
        setTexturesLoaded(true)
      }
    }

    // Check if textures are already cached
    const allPaths = [
      selectedVariant.illustration.front,
      selectedVariant.illustration.back,
      card.foil.front,
      card.foil.back,
      card.normalMap.front,
      card.normalMap.back,
    ].filter(Boolean)

    const allCached = allPaths.every((path) => isTextureCached(path))

    if (allCached) {
      // Textures are cached, load them immediately
      loadCardTextures()
    } else {
      // Textures not cached, load them (this will be fast for preloaded cards)
      loadCardTextures()
    }

    return () => {
      mounted = false
    }
  }, [selectedVariant, card.foil, card.normalMap])

  const rotationRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.7, 0))

  const envMap = useMemo(() => {
    const map = selectedVariant.foilColor === "gold" ? goldEnvMap : silverEnvMap
    if (!map) return null

    return {
      map,
      rotation:
        selectedVariant.foilColor === "gold"
          ? new THREE.Euler(0.4, 0, 0.1)
          : new THREE.Euler(-0.3, 0.3, 1.2),
      intensity: selectedVariant.foilColor === "gold" ? 3 : 4,
    }
  }, [selectedVariant.foilColor, goldEnvMap, silverEnvMap])

  const pointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (!active) setHover(true)
  }
  const pointerOut = () => !active && setHover(false)

  const click = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setActive(id)
    setHover(false)
  }

  useEffect(() => {
    const pointerMove = (e: MouseEvent) => {
      if (active === id) {
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = -(e.clientY / window.innerHeight) * 2 + 1
        setMousePos({ x, y })
      }
    }
    window.addEventListener("mousemove", pointerMove)
    return () => window.removeEventListener("mousemove", pointerMove)
  }, [active, id])

  useFrame((state, delta) => {
    if (groupRef.current) {
      let targetPosition: [number, number, number]
      let smoothTime: number
      let targetRotation: [number, number, number]
      let intensity: number

      if (active === id) {
        targetPosition = [0, windowWidth < 780 ? 15 : 16, 0]
        smoothTime = 0.4
        intensity = 0.25
        const rotationX = mousePos.y * intensity
        const rotationY = mousePos.x * intensity
        targetRotation = [
          Math.PI / 2 - rotationX,
          card.isFlipped ? Math.PI - rotationY + Math.PI : Math.PI - rotationY,
          Math.PI,
        ]
      } else if (hover) {
        targetPosition = [
          groupRef.current.position.x,
          0.5,
          groupRef.current.position.z,
        ]
        smoothTime = 0.1
        targetRotation = [0, card.isFlipped ? 0.7 + Math.PI : 0.7, 0]
      } else {
        targetPosition = [initialPos.x, initialPos.y, initialPos.z]
        smoothTime = active === null ? 0.1 : 0.5
        targetRotation = [0, card.isFlipped ? 0.7 + Math.PI : 0.7, 0]
      }

      easing.damp3(groupRef.current.position, targetPosition, smoothTime, delta)
      easing.damp3(
        rotationRef.current,
        targetRotation,
        active ? 0.5 : 0.175,
        delta
      )
      groupRef.current.rotation.set(
        rotationRef.current.x,
        rotationRef.current.y,
        rotationRef.current.z
      )

      if (!isLoaded) {
        easing.damp3(
          state.camera.position,
          [state.camera.position.x, 30, 0],
          2.0,
          delta
        )
      } else {
        if (active) {
          easing.damp3(
            state.camera.position,
            [state.camera.position.x, 20.5, active ? 0 : 8],
            2.0,
            delta
          )
        } else {
          easing.damp3(
            state.camera.position,
            [state.camera.position.x, 2, active ? 0 : 8],
            2.0,
            delta
          )
        }
      }
    }
  })

  // Don't render if textures aren't loaded yet
  if (!texturesLoaded) {
    return (
      <group ref={groupRef} position={initialPos} rotation={[0, 0.7, 0]}>
        <mesh geometry={geometry} receiveShadow castShadow>
          <meshPhysicalMaterial color={selectedVariant.cardColor} opacity={1} />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={initialPos} rotation={[0, 0.7, 0]}>
      {/* BASE CARD */}
      <mesh
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        ref={meshRef}
        geometry={geometry}
        receiveShadow
        castShadow
        onClick={click}
      >
        <meshPhysicalMaterial color={selectedVariant.cardColor} opacity={1} />

        {/* FRONT ILLUSTRATION */}
        {textures.frontIllustration &&
          (card.name === "Protagonist/Antagonist" ? (
            <Decal
              receiveShadow={active ? false : true}
              position={[0, 0, 0.1]}
              scale={[1, 1.75, 0.1]}
              rotation={[0, 0, Math.PI * 2]}
            >
              <meshPhysicalMaterial
                polygonOffset
                polygonOffsetFactor={-1}
                map={textures.frontIllustration}
                roughness={0.9}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </Decal>
          ) : (
            <Decal
              receiveShadow={active ? false : true}
              scale={[1, 1.75, 0.1]}
              rotation={[0, 0, Math.PI * 2]}
            >
              <meshPhysicalMaterial
                polygonOffset
                polygonOffsetFactor={-1}
                map={textures.frontIllustration}
                roughness={0.9}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </Decal>
          ))}

        {/* BACK ILLUSTRATION */}
        {textures.backIllustration && (
          <Decal
            receiveShadow={active ? false : true}
            position={[0, 0, -0.04]}
            scale={[1, 1.75, 0.1]}
            rotation={[0, Math.PI, 0]}
          >
            <meshPhysicalMaterial
              polygonOffset
              polygonOffsetFactor={-1}
              map={textures.backIllustration}
              roughness={0.9}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </Decal>
        )}
      </mesh>

      {/* FRONT FOIL */}
      {textures.frontFoil && envMap && (
        <mesh geometry={planeGeometry} position={[0, 0, 0.03]}>
          <meshPhysicalMaterial
            transparent
            roughness={0.1}
            metalness={0.8}
            reflectivity={0.8}
            sheen={1}
            map={textures.frontFoil}
            normalMap={textures.frontNormal}
            normalScale={new THREE.Vector2(0.1, 0.1)}
            envMap={envMap.map}
            envMapIntensity={envMap.intensity}
            envMapRotation={envMap.rotation}
          />
        </mesh>
      )}

      {/* BACK FOIL */}
      {textures.backFoil && envMap && (
        <mesh
          geometry={planeGeometry}
          rotation={[0, Math.PI, 0]}
          position={[0, 0, -0.01]}
        >
          <meshPhysicalMaterial
            side={THREE.DoubleSide}
            transparent
            roughness={0.1}
            metalness={0.8}
            reflectivity={0.8}
            sheen={1}
            map={textures.backFoil}
            normalMap={textures.backNormal}
            normalScale={new THREE.Vector2(0.1, 0.1)}
            envMap={envMap.map}
            envMapIntensity={envMap.intensity}
            envMapRotation={envMap.rotation}
          />
        </mesh>
      )}
    </group>
  )
}

export default Card
