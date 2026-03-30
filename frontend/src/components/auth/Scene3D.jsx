import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useRef } from "react";

function AnimatedBlob() {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.002;
      ref.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Icosahedron ref={ref} args={[2, 1]}>
        <MeshDistortMaterial
          color="#00FFF7"
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </Icosahedron>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} />
        <Stars radius={100} depth={50} count={3000} factor={4} fade />
        <AnimatedBlob />
      </Canvas>
    </div>
  );
}