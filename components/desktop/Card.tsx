"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo, useState, Dispatch, SetStateAction, useEffect } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { useTexture, Decal } from "@react-three/drei";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { CardType } from "@/app/definitions";

const createRoundedRectShape = (width: number, height: number, radius: number): THREE.Shape => {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2 + radius);
  shape.lineTo(-width / 2, height / 2 - radius);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + radius, height / 2);
  shape.lineTo(width / 2 - radius, height / 2);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius);
  shape.lineTo(width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2 - radius, -height / 2);
  shape.lineTo(-width / 2 + radius, -height / 2);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + radius);
  return shape;
};

interface CardProps {
  card: CardType;
  id: number;
  cardPos: number;
  active: number | null;
  setActive: Dispatch<SetStateAction<number | null>>;
  isLoaded: boolean;
}

const Card = ({
  card,
  id,
  cardPos,
  active,
  setActive,
  isLoaded,
}: CardProps) => {
  const [hover, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const roundedRectShape = createRoundedRectShape(1.0, 1.75, 0.1);
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape, { depth: 0.02, bevelEnabled: false });
  const planeGeometry = useMemo(() => {
    const shape = createRoundedRectShape(1.0, 1.75, 0.1);
    const geo = new THREE.ShapeGeometry(shape, 32);
    geo.computeVertexNormals();
    const uvs = geo.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i] = (uvs[i] + 0.5) * (1.0 / 1.0);
      uvs[i + 1] = (uvs[i + 1] + 0.875) * (1.0 / 1.75);
    }
    geo.attributes.uv.needsUpdate = true;
    return geo;
  }, []);
  const initialPos = useMemo(() => new THREE.Vector3(cardPos * 0.4, 0, 0), [cardPos]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedVariant = card.colorVariations[card.selectedVariantIndex];

  const getTexture = (texture: string) => {
    if (!texture) return null;
    const tex = useTexture(texture);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.generateMipmaps = true;
    return tex;
  };

  const frontIllustration = getTexture(selectedVariant.illustration.front);
  const backIllustration = getTexture(selectedVariant.illustration.back);
  const frontFoil = getTexture(card.foil.front);
  const backFoil = getTexture(card.foil.back);
  const frontNormal = getTexture(card.normalMap.front);
  const backNormal = getTexture(card.normalMap.back);

  const rotationRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.7, 0));
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  const goldEnvMap = {
    map: useLoader(RGBELoader, "/pretville_cinema_1k.hdr"),
    rotation: new THREE.Euler(0.4, 0, 0.1),
    intensity: 3,
  };

  const silverEnvMap = {
    map: useLoader(RGBELoader, "/st_peters_square_night_1k.hdr"),
    rotation: new THREE.Euler(-0.3, 0.3, 1.2),
    intensity: 4,
  };

  const envMap = selectedVariant.foilColor === "gold" ? goldEnvMap : silverEnvMap;

  envMap.map.mapping = THREE.EquirectangularReflectionMapping;

  const pointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!active) setHover(true);
  };
  const pointerOut = () => !active && setHover(false);

  const click = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setActive(id);
    setHover(false);
  };

  useEffect(() => {
    const pointerMove = (e: MouseEvent) => {
      if (active === id) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMousePos({ x, y });
      }
    };
    window.addEventListener("mousemove", pointerMove);
    return () => window.removeEventListener("mousemove", pointerMove);
  }, [active, id]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      let targetPosition: [number, number, number];
      let smoothTime: number;
      let targetRotation: [number, number, number];
      let intensity: number;

      if (active === id) {
        targetPosition = [0, windowWidth < 780 ? 15 : 16, 0];
        smoothTime = 0.4;
        intensity = 0.25;
        const rotationX = mousePos.y * intensity;
        const rotationY = mousePos.x * intensity;
        targetRotation = [
          Math.PI / 2 - rotationX,
          card.isFlipped ? Math.PI - rotationY + Math.PI : Math.PI - rotationY,
          Math.PI,
        ];
      } else if (hover) {
        targetPosition = [groupRef.current.position.x, 0.5, groupRef.current.position.z];
        smoothTime = 0.1;
        targetRotation = [0, card.isFlipped ? 0.7 + Math.PI : 0.7, 0];
      } else {
        targetPosition = [initialPos.x, initialPos.y, initialPos.z];
        smoothTime = active === null ? 0.1 : 0.5;
        targetRotation = [0, card.isFlipped ? 0.7 + Math.PI : 0.7, 0];
      }

      easing.damp3(groupRef.current.position, targetPosition, smoothTime, delta);
      easing.damp3(rotationRef.current, targetRotation, active ? 0.5 : 0.175, delta);
      groupRef.current.rotation.set(rotationRef.current.x, rotationRef.current.y, rotationRef.current.z);

      if (!isLoaded) {
        easing.damp3(state.camera.position, [state.camera.position.x, 30, 0], 2.0, delta);
      } else {
        if (active) {
          easing.damp3(state.camera.position, [state.camera.position.x, 20.5, active ? 0 : 8], 2.0, delta);
        } else {
          easing.damp3(state.camera.position, [state.camera.position.x, 2, active ? 0 : 8], 2.0, delta);
        }
      }
    }
  });

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
        {
          frontIllustration ?
            (
              <Decal
                receiveShadow={active ? false : true}
                scale={[1, 1.75, 0.1]}
                rotation={[0, 0, Math.PI * 2]}>
                <meshPhysicalMaterial
                  polygonOffset
                  polygonOffsetFactor={-1}
                  map={frontIllustration}
                  roughness={0.9}
                  metalness={0.1}
                  side={THREE.DoubleSide}
                />
              </Decal>
            ) : null
        }

        {/* BACK ILLUSTRATION */}
        {
          backIllustration ? (
            <Decal
              receiveShadow={active ? false : true}
              position={[0, 0, -0.04]}
              scale={[1, 1.75, 0.1]}
              rotation={[0, Math.PI, 0]}
            >
              <meshPhysicalMaterial
                polygonOffset
                polygonOffsetFactor={-1}
                map={backIllustration}
                roughness={0.9}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </Decal>
          ) : null
        }
      </mesh>


      {/* FRONT FOIL */}
      {
        frontFoil ? (
          <mesh geometry={planeGeometry} position={[0, 0, 0.03]}>
            <meshPhysicalMaterial
              transparent
              roughness={0.1}
              metalness={0.8}
              reflectivity={0.8}
              sheen={1}
              map={frontFoil}
              normalMap={frontNormal}
              normalScale={new THREE.Vector2(0.1, 0.1)}
              envMap={envMap.map}
              envMapIntensity={envMap.intensity}
              envMapRotation={envMap.rotation}
            />
          </mesh>
        ) : null
      }

      {/* BACK FOIL */}
      {
        backFoil ? (
          <mesh geometry={planeGeometry} rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
            <meshPhysicalMaterial
              side={THREE.DoubleSide}
              transparent
              roughness={0.1}
              metalness={0.8}
              reflectivity={0.8}
              sheen={1}
              map={backFoil}
              normalMap={backNormal}
              normalScale={new THREE.Vector2(0.1, 0.1)}
              envMap={envMap.map}
              envMapIntensity={envMap.intensity}
              envMapRotation={envMap.rotation}
            />
          </mesh>
        ) : null
      }
    </group>
  );
};

export default Card;