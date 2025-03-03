// "use client"

// import { useFrame } from "@react-three/fiber"
// import { useRef, useMemo, useState, Dispatch, SetStateAction, useEffect } from "react"
// import * as THREE from 'three'
// import { easing } from "maath"
// import GoldFoil from "./GoldFoil"
// import { useTexture, Decal } from "@react-three/drei"

// const createRoundedRectShape = (width: number, height: number, radius: number): THREE.Shape => {
//   const shape = new THREE.Shape()
//   shape.moveTo(-width / 2, -height / 2 + radius)
//   shape.lineTo(-width / 2, height / 2 - radius)
//   shape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + radius, height / 2)
//   shape.lineTo(width / 2 - radius, height / 2)
//   shape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius)
//   shape.lineTo(width / 2, -height / 2 + radius)
//   shape.quadraticCurveTo(width / 2, -height / 2, width / 2 - radius, -height / 2)
//   shape.lineTo(-width / 2 + radius, -height / 2)
//   shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + radius)
//   return shape
// }

// interface CardProps {
//   id: number;
//   cardPos: number;
//   color: string;
//   totalCards: number;
//   active: number | null;
//   setActive: Dispatch<SetStateAction<number | null>>;
// }

// const Card = ({ id, cardPos, color, totalCards, active, setActive }: CardProps) => {
//   const [hover, setHover] = useState(false)
//   const meshRef = useRef<any>(null)
//   const roundedRectShape = createRoundedRectShape(1.0, 1.75, 0.1)
//   const geometry = new THREE.ExtrudeGeometry(roundedRectShape, { depth: 0.02, bevelEnabled: false })
//   const initialPos = useMemo(() => new THREE.Vector3(cardPos * 0.4, 0, 0), [cardPos])
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

//   const bookmark = useTexture("/bookmark.png")
//   bookmark.minFilter = THREE.LinearFilter;
//   bookmark.magFilter = THREE.LinearFilter;
//   bookmark.anisotropy = 16;
//   bookmark.generateMipmaps = true;
//   bookmark.offset.set(0.02, 0)
//   const [foil, displacementMap, normalMap, envMap] = useTexture(["/bookmark-foil.png", "/DisplacementMap.png", "/NormalMap6.png", "/EnvMap.png"])


//   const pointerOver = (e: { stopPropagation: () => any }) => {
//     e.stopPropagation()
//     if (!active) setHover(true)
//   }
//   const pointerOut = () => !active && setHover(false)
//   const click = (e: { stopPropagation: () => any }) => (e.stopPropagation(), !active ? setActive(id) : setActive(null), setHover(false))

//   const pointerMove = (e: MouseEvent) => {
//     if (active === id) {
//       const x = (e.clientX / window.innerWidth) * 2 - 1
//       const y = -(e.clientY / window.innerHeight) * 2 + 1
//       setMousePos({ x, y })
//     }
//   }

//   useEffect(() => {
//     window.addEventListener('mousemove', pointerMove as any)
//     return () => window.removeEventListener('mousemove', pointerMove as any)
//   }, [active, id])

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       let targetPosition: [number, number, number];
//       let smoothTime: number;
//       let targetRotation: [number, number, number];
//       let intensity: number

//       if (active === id) {
//         targetPosition = [0, 16, 0];
//         smoothTime = 0.4;
//         intensity = 0.25
//         const rotationX = mousePos.y * intensity
//         const rotationY = mousePos.x * intensity
//         targetRotation = [Math.PI / 2 - rotationX, Math.PI - rotationY, Math.PI]
//       } else if (hover) {
//         targetPosition = [
//           meshRef.current.position.x,
//           0.5,
//           meshRef.current.position.z
//         ];
//         smoothTime = 0.1;
//         targetRotation = [0, 0.7, 0]
//       } else {
//         targetPosition = [
//           initialPos.x,
//           initialPos.y,
//           initialPos.z
//         ];
//         smoothTime = active === null ? 0.1 : 0.5;
//         targetRotation = [0, 0.7, 0]
//       }

//       // CARD POSITION ANIMATION
//       easing.damp3(
//         meshRef.current.position,
//         targetPosition,
//         smoothTime,
//         delta
//       );

//       // CARD ROTATION ANIMATION
//       easing.damp3(
//         meshRef.current.rotation,
//         targetRotation,
//         active ? 0.5 : 0.175,
//         delta
//       )

//       // CAMERA POSITION ANIMATION
//       easing.damp3(
//         state.camera.position,
//         [state.camera.position.x, active ? 20.5 : 2, active ? 0 : 8],
//         2.0,
//         delta
//       );
//     }
//   })

//   return (
//     <mesh
//       onPointerOver={pointerOver}
//       onPointerOut={pointerOut}
//       ref={meshRef}
//       geometry={geometry}
//       receiveShadow
//       castShadow
//       position={initialPos}
//       rotation={[0, 0.7, 0]}
//       onClick={click}
//     >
//       <meshPhysicalMaterial
//         color={color}
//         opacity={1}
//         side={THREE.DoubleSide}
//         roughness={0.9}
//         metalness={0.2}
//         displacementMap={foil}
//       // displacementBias={0.11}
//       // displacementScale={0.01}
//       />
//       <Decal receiveShadow={active ? false : true} position={[0, 0, 0]} scale={[1, 1.75, 0.1]} >
//         <meshPhysicalMaterial
//           polygonOffset
//           polygonOffsetFactor={-1}
//           map={bookmark}
//           map-anisotropy={1}
//           roughness={0.9}
//           metalness={0.2}
//           // map-flipY={false}
//           map-flipX={false}
//         />
//       </Decal>
//       <GoldFoil />
//     </mesh>
//   )
// }

// export default Card;

// "use client";

// import { useFrame } from "@react-three/fiber";
// import { useRef, useMemo, useState, Dispatch, SetStateAction, useEffect } from "react";
// import * as THREE from "three";
// import { easing } from "maath";
// import GoldFoil from "./GoldFoil";
// import { useTexture, Decal } from "@react-three/drei";

// const createRoundedRectShape = (width: number, height: number, radius: number): THREE.Shape => {
//   const shape = new THREE.Shape();
//   shape.moveTo(-width / 2, -height / 2 + radius);
//   shape.lineTo(-width / 2, height / 2 - radius);
//   shape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + radius, height / 2);
//   shape.lineTo(width / 2 - radius, height / 2);
//   shape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius);
//   shape.lineTo(width / 2, -height / 2 + radius);
//   shape.quadraticCurveTo(width / 2, -height / 2, width / 2 - radius, -height / 2);
//   shape.lineTo(-width / 2 + radius, -height / 2);
//   shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + radius);
//   return shape;
// };

// interface CardProps {
//   id: number;
//   cardPos: number;
//   color: string;
//   totalCards: number;
//   active: number | null;
//   setActive: Dispatch<SetStateAction<number | null>>;
// }

// const Card = ({ id, cardPos, color, totalCards, active, setActive }: CardProps) => {
//   const [hover, setHover] = useState(false);
//   const meshRef = useRef<any>(null);
//   const frontPlaneRef = useRef<any>(null);
//   const roundedRectShape = createRoundedRectShape(1.0, 1.75, 0.1);
//   const geometry = new THREE.ExtrudeGeometry(roundedRectShape, { depth: 0.02, bevelEnabled: false });
//   const planeGeometry = new THREE.ExtrudeGeometry(roundedRectShape, { depth: 0.0, bevelEnabled: false });
//   const initialPos = useMemo(() => new THREE.Vector3(cardPos * 0.4, 0, 0), [cardPos]);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   const [bookmark, foil, displacementMap, normalMap, envMap] = useTexture([
//     "/bookmark.png",
//     "/bookmark-foil.png",
//     "/DisplacementMap.png",
//     "/NormalMap6.png",
//     "/EnvMap.png",
//   ]);

//   bookmark.minFilter = THREE.LinearFilter;
//   bookmark.magFilter = THREE.LinearFilter;
//   bookmark.anisotropy = 16;
//   bookmark.generateMipmaps = true;
//   // bookmark.offset.set(0.02, 0);

//   displacementMap.offset.set(-0.5, -0.5)

//   const pointerOver = (e: { stopPropagation: () => any }) => {
//     e.stopPropagation();
//     if (!active) setHover(true);
//   };
//   const pointerOut = () => !active && setHover(false);
//   const click = (e: { stopPropagation: () => any }) => (
//     e.stopPropagation(),
//     !active ? setActive(id) : setActive(null),
//     setHover(false)
//   );

//   const pointerMove = (e: MouseEvent) => {
//     if (active === id) {
//       const x = (e.clientX / window.innerWidth) * 2 - 1;
//       const y = -(e.clientY / window.innerHeight) * 2 + 1;
//       setMousePos({ x, y });
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", pointerMove as any);
//     return () => window.removeEventListener("mousemove", pointerMove as any);
//   }, [active, id]);

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       let targetPosition: [number, number, number];
//       let targetFrontPosition: [number, number, number];
//       let smoothTime: number;
//       let targetRotation: [number, number, number];
//       let intensity: number;

//       if (active === id) {
//         targetPosition = [0, 16, 0];
//         targetFrontPosition = [0, 16.1, 0];
//         smoothTime = 0.4;
//         intensity = 0.25;
//         const rotationX = mousePos.y * intensity;
//         const rotationY = mousePos.x * intensity;
//         targetRotation = [Math.PI / 2 - rotationX, Math.PI - rotationY, Math.PI];
//       } else if (hover) {
//         targetPosition = [meshRef.current.position.x, 0.5, meshRef.current.position.z];
//         targetFrontPosition = [meshRef.current.position.x, 0.5, meshRef.current.position.z - 0.1];
//         smoothTime = 0.1;
//         targetRotation = [0, 0.7, 0];
//       } else {
//         targetPosition = [initialPos.x, initialPos.y, initialPos.z];
//         targetFrontPosition = [initialPos.x, initialPos.y, initialPos.z - 0.1];
//         smoothTime = active === null ? 0.1 : 0.5;
//         targetRotation = [0, 0.7, 0];
//       }

//       // CARD POSITION ANIMATION
//       easing.damp3(meshRef.current.position, targetPosition, smoothTime, delta);
//       easing.damp3(frontPlaneRef.current.position, targetFrontPosition, smoothTime, delta);

//       // CARD ROTATION ANIMATION
//       easing.damp3(meshRef.current.rotation, targetRotation, active ? 0.5 : 0.175, delta);
//       easing.damp3(frontPlaneRef.current.rotation, targetRotation, active ? 0.5 : 0.175, delta);

//       // CAMERA POSITION ANIMATION
//       easing.damp3(state.camera.position, [state.camera.position.x, active ? 20.5 : 2, active ? 0 : 8], 2.0, delta);
//     }
//   });

//   return (
//     <group>
//       {/* Base Card (no displacement) */}
//       <mesh
//         onPointerOver={pointerOver}
//         onPointerOut={pointerOut}
//         ref={meshRef}
//         geometry={geometry}
//         receiveShadow
//         castShadow
//         position={initialPos}
//         rotation={[0, 0.7, 0]}
//         onClick={click}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           opacity={1}
//           side={THREE.DoubleSide}
//           roughness={0.9}
//           metalness={0.2}
//         />
//         <Decal receiveShadow={active ? false : true} position={[0, 0, 0]} scale={[1, 1.75, 0.1]}>
//           <meshPhysicalMaterial
//             polygonOffset
//             polygonOffsetFactor={-1}
//             map={bookmark}
//             roughness={0.9}
//             metalness={0.2}
//             map-flipX={false}
//           />
//         </Decal>
//         {/* <GoldFoil /> */}
//       </mesh>

//       {/* Front Plane with Displacement */}
//       <mesh
//         ref={frontPlaneRef}
//         geometry={planeGeometry}
//       >
//         {/* <planeGeometry args={[1.0, 1.75, 32, 32]} // Match card width/height, add segments 
//         /> */}
//         <meshPhysicalMaterial
//           // color={color}
//           // side={THREE.DoubleSide}          
//           roughness={0.1}
//           metalness={0.8}
//           displacementMap={displacementMap}
//           displacementScale={0.01} // Adjust as needed
//           // displacementBias={0.11} // Uncomment if needed
//           // map={bookmark} // Optionally apply the bookmark texture
//           normalMap={normalMap} // If you want normal mapping too
//         />
//       </mesh>
//     </group>
//   );
// };

// export default Card;

// "use client";

// import { useFrame } from "@react-three/fiber";
// import { useRef, useMemo, useState, Dispatch, SetStateAction, useEffect } from "react";
// import * as THREE from "three";
// import { easing } from "maath";
// import GoldFoil from "./GoldFoil";
// import { useTexture, Decal } from "@react-three/drei";

// const createRoundedRectShape = (width: number, height: number, radius: number): THREE.Shape => {
//   const shape = new THREE.Shape();
//   shape.moveTo(-width / 2, -height / 2 + radius);
//   shape.lineTo(-width / 2, height / 2 - radius);
//   shape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + radius, height / 2);
//   shape.lineTo(width / 2 - radius, height / 2);
//   shape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius);
//   shape.lineTo(width / 2, -height / 2 + radius);
//   shape.quadraticCurveTo(width / 2, -height / 2, width / 2 - radius, -height / 2);
//   shape.lineTo(-width / 2 + radius, -height / 2);
//   shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + radius);
//   return shape;
// };

// interface CardProps {
//   id: number;
//   cardPos: number;
//   color: string;
//   totalCards: number;
//   active: number | null;
//   setActive: Dispatch<SetStateAction<number | null>>;
// }

// const Card = ({ id, cardPos, color, totalCards, active, setActive }: CardProps) => {
//   const [hover, setHover] = useState(false);
//   const meshRef = useRef<any>(null);
//   const frontPlaneRef = useRef<any>(null);
//   const roundedRectShape = createRoundedRectShape(1.0, 1.75, 0.1);
//   const geometry = new THREE.ExtrudeGeometry(roundedRectShape, { depth: 0.02, bevelEnabled: false });
//   const planeGeometry = useMemo(() => {
//     const shape = createRoundedRectShape(1.0, 1.75, 0.1);
//     const geo = new THREE.ShapeGeometry(shape, 32); // Flat geometry with smooth curves
//     // Adjust UVs to fit the 1.0 x 1.75 plane
//     geo.computeVertexNormals();
//     const uvs = geo.attributes.uv.array;
//     for (let i = 0; i < uvs.length; i += 2) {
//       uvs[i] = (uvs[i] + 0.5) * (1.0 / 1.0); // Normalize X to 0-1
//       uvs[i + 1] = (uvs[i + 1] + 0.875) * (1.0 / 1.75); // Normalize Y to 0-1 based on height
//     }
//     geo.attributes.uv.needsUpdate = true;
//     return geo;
//   }, []);
//   const initialPos = useMemo(() => new THREE.Vector3(cardPos * 0.4, 0, 0), [cardPos]);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   const [bookmark, foil, displacementMap, normalMap, envMap] = useTexture([
//     "/bookmark.png",
//     "/bookmark-foil.png",
//     "/DisplacementMap.png",
//     "/NormalMap4.png",
//     "/EnvMap.png",
//   ]);

//   bookmark.minFilter = THREE.LinearFilter;
//   bookmark.magFilter = THREE.LinearFilter;
//   bookmark.anisotropy = 16;
//   bookmark.generateMipmaps = true;
//   bookmark.offset.set(0.02, 0)


//   // Reset displacementMap offset and set repeat to match plane dimensions
//   displacementMap.offset.set(0, 0); // Center the texture
//   displacementMap.repeat.set(1.0, 1.75); // Scale texture to match plane's aspect ratio
//   displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping; // Ensure proper wrapping

//   const pointerOver = (e: { stopPropagation: () => any }) => {
//     e.stopPropagation();
//     if (!active) setHover(true);
//   };
//   const pointerOut = () => !active && setHover(false);
//   const click = (e: { stopPropagation: () => any }) => (
//     e.stopPropagation(),
//     !active ? setActive(id) : setActive(null),
//     setHover(false)
//   );

//   const pointerMove = (e: MouseEvent) => {
//     if (active === id) {
//       const x = (e.clientX / window.innerWidth) * 2 - 1;
//       const y = -(e.clientY / window.innerHeight) * 2 + 1;
//       setMousePos({ x, y });
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", pointerMove as any);
//     return () => window.removeEventListener("mousemove", pointerMove as any);
//   }, [active, id]);

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       let targetPosition: [number, number, number];
//       let targetFrontPosition: [number, number, number];
//       let smoothTime: number;
//       let targetRotation: [number, number, number];
//       let intensity: number;

//       if (active === id) {
//         targetPosition = [0, 16, 0];
//         targetFrontPosition = [0, 16.03, 0];
//         smoothTime = 0.4;
//         intensity = 0.25;
//         const rotationX = mousePos.y * intensity;
//         const rotationY = mousePos.x * intensity;
//         targetRotation = [Math.PI / 2 - rotationX, Math.PI - rotationY, Math.PI];
//       } else if (hover) {
//         targetPosition = [meshRef.current.position.x, 0.5, meshRef.current.position.z];
//         targetFrontPosition = [meshRef.current.position.x, 0.5, meshRef.current.position.z + 0.04];
//         smoothTime = 0.1;
//         targetRotation = [0, 0.7, 0];
//       } else {
//         targetPosition = [initialPos.x, initialPos.y, initialPos.z];
//         targetFrontPosition = [initialPos.x, initialPos.y, initialPos.z + 0.04];
//         smoothTime = active === null ? 0.1 : 0.5;
//         targetRotation = [0, 0.7, 0];
//       }

//       // CARD POSITION ANIMATION
//       easing.damp3(meshRef.current.position, targetPosition, smoothTime, delta);
//       easing.damp3(frontPlaneRef.current.position, targetFrontPosition, smoothTime, delta);

//       // CARD ROTATION ANIMATION
//       easing.damp3(meshRef.current.rotation, targetRotation, active ? 0.5 : 0.175, delta);
//       easing.damp3(frontPlaneRef.current.rotation, targetRotation, active ? 0.5 : 0.175, delta);

//       // CAMERA POSITION ANIMATION
//       easing.damp3(state.camera.position, [state.camera.position.x, active ? 20.5 : 2, active ? 0 : 8], 2.0, delta);
//     }
//   });

//   return (
//     <group>
//       {/* Base Card (no displacement) */}
//       <mesh
//         onPointerOver={pointerOver}
//         onPointerOut={pointerOut}
//         ref={meshRef}
//         geometry={geometry}
//         receiveShadow
//         castShadow
//         position={initialPos}
//         rotation={[0, 0.7, 0]}
//         onClick={click}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           opacity={1}
//           side={THREE.DoubleSide}
//           roughness={0.9}
//           metalness={0.2}
//         />
//         <Decal receiveShadow={active ? false : true} position={[0, 0, 0]} scale={[1, 1.75, 0.1]}>
//           <meshPhysicalMaterial
//             polygonOffset
//             polygonOffsetFactor={-1}
//             map={bookmark}
//             roughness={0.9}
//             metalness={0.2}
//             map-flipX={false}
//           />
//         </Decal>
//         {/* <GoldFoil /> */}
//       </mesh>

//       {/* Front Plane with Displacement */}
//       <mesh ref={frontPlaneRef} geometry={planeGeometry}>
//         <meshPhysicalMaterial
//           transparent
//           roughness={0.1}
//           metalness={0.8}
//           map={foil}
//           normalMap={normalMap} // If you want normal mapping too
//           normalScale={new THREE.Vector2(0.1, 0.1)}
//           sheen={1}
//           sheenColor={"#ffcc00"}
//         />
//       </mesh>
//     </group>
//   );
// };

// export default Card;

"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, Dispatch, SetStateAction, useEffect } from "react";
import * as THREE from "three";
import { easing } from "maath";
import GoldFoil from "./GoldFoil";
import { useTexture, Decal } from "@react-three/drei";

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
  id: number;
  cardPos: number;
  color: string;
  totalCards: number;
  active: number | null;
  setActive: Dispatch<SetStateAction<number | null>>;
}

const Card = ({ id, cardPos, color, totalCards, active, setActive }: CardProps) => {
  const [hover, setHover] = useState(false);
  const groupRef = useRef<any>(null); // Ref for the group
  const meshRef = useRef<any>(null);
  const frontPlaneRef = useRef<any>(null);
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

  const [bookmark, foil, displacementMap, normalMap, envMap] = useTexture([
    "/bookmark.png",
    "/bookmark-foil.png",
    "/DisplacementMap.png",
    "/NormalMap4.png",
    "/EnvMap.png",
  ]);

  bookmark.minFilter = THREE.LinearFilter;
  bookmark.magFilter = THREE.LinearFilter;
  bookmark.anisotropy = 16;
  bookmark.generateMipmaps = true;
  bookmark.offset.set(0.02, 0);

  displacementMap.offset.set(0, 0);
  displacementMap.repeat.set(1.0, 1.75);
  displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;

  const pointerOver = (e: { stopPropagation: () => any }) => {
    e.stopPropagation();
    if (!active) setHover(true);
  };
  const pointerOut = () => !active && setHover(false);
  const click = (e: { stopPropagation: () => any }) => (
    e.stopPropagation(),
    !active ? setActive(id) : setActive(null),
    setHover(false)
  );

  const pointerMove = (e: MouseEvent) => {
    if (active === id) {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", pointerMove as any);
    return () => window.removeEventListener("mousemove", pointerMove as any);
  }, [active, id]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      let targetPosition: [number, number, number];
      let smoothTime: number;
      let targetRotation: [number, number, number];
      let intensity: number;

      if (active === id) {
        targetPosition = [0, 16, 0];
        smoothTime = 0.4;
        intensity = 0.25;
        const rotationX = mousePos.y * intensity;
        const rotationY = mousePos.x * intensity;
        targetRotation = [Math.PI / 2 - rotationX, Math.PI - rotationY, Math.PI];
      } else if (hover) {
        targetPosition = [groupRef.current.position.x, 0.5, groupRef.current.position.z];
        smoothTime = 0.1;
        targetRotation = [0, 0.7, 0];
      } else {
        targetPosition = [initialPos.x, initialPos.y, initialPos.z];
        smoothTime = active === null ? 0.1 : 0.5;
        targetRotation = [0, 0.7, 0];
      }

      // GROUP POSITION ANIMATION
      easing.damp3(groupRef.current.position, targetPosition, smoothTime, delta);

      // GROUP ROTATION ANIMATION
      easing.damp3(groupRef.current.rotation, targetRotation, active ? 0.5 : 0.175, delta);

      // CAMERA POSITION ANIMATION
      easing.damp3(state.camera.position, [state.camera.position.x, active ? 20.5 : 2, active ? 0 : 8], 2.0, delta);
    }
  });

  return (
    <group ref={groupRef} position={initialPos} rotation={[0, 0.7, 0]}>
      {/* Base Card (no displacement) */}
      <mesh
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        ref={meshRef}
        geometry={geometry}
        receiveShadow
        castShadow
        onClick={click}
      >
        <meshPhysicalMaterial
          color={color}
          opacity={1}
          side={THREE.DoubleSide}
          roughness={0.9}
          metalness={0.2}
        />
        <Decal receiveShadow={active ? false : true} position={[0, 0, 0]} scale={[1, 1.75, 0.1]}>
          <meshPhysicalMaterial
            polygonOffset
            polygonOffsetFactor={-1}
            map={bookmark}
            roughness={0.9}
            metalness={0.2}
            map-flipX={false}
          />
        </Decal>
        {/* <GoldFoil /> */}
      </mesh>

      {/* Front Plane with Displacement */}
      <mesh ref={frontPlaneRef} geometry={planeGeometry} position={[0, 0, 0.04]}>
        <meshPhysicalMaterial
          transparent
          roughness={0.1}
          metalness={0.8}
          map={foil}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.1, 0.1)}
          sheen={1}
          sheenColor={"#ffcc00"}
        />
      </mesh>
    </group>
  );
};

export default Card;