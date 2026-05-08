import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";

type AnimName = "idle" | "walk" | "run" | "auto";

// Xbot — slim, athletic humanoid (younger, leaner build than Soldier)
const MODEL_URL = "https://threejs.org/examples/models/gltf/Xbot.glb";
useGLTF.preload(MODEL_URL);

// Re-skin the Xbot meshes into a football kit:
//   Shirt  → red    (torso / arms above elbow area uses BODY mesh)
//   Shorts → white
//   Boots  → black
//   Skin   → warm tan
function applyKit(scene: THREE.Object3D) {
  scene.traverse((o: any) => {
    if (!o.isMesh && !o.isSkinnedMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;

    const name: string = (o.name || "").toLowerCase();
    let color = "#E8B89A"; // skin tone (default)
    let roughness = 0.75;
    let metalness = 0.05;

    if (name.includes("shirt") || name.includes("torso") || name.includes("body")) {
      // Jersey — bright red kit
      color = "#E63946";
      roughness = 0.65;
    }
    if (name.includes("short") || name.includes("pant") || name.includes("leg") && !name.includes("lower")) {
      // Shorts — white
      color = "#F5F5F5";
      roughness = 0.7;
    }
    if (name.includes("shoe") || name.includes("boot") || name.includes("foot")) {
      // Boots — black with sheen
      color = "#0E0E10";
      roughness = 0.35;
      metalness = 0.2;
    }
    if (name.includes("head") || name.includes("face") || name.includes("hair")) {
      color = name.includes("hair") ? "#2A1810" : "#E8B89A";
      roughness = 0.85;
    }

    // Xbot uses a single "Beta_Surface" material on the body and "Beta_Joints"
    // on the joints. Detect by material name as fallback.
    const matName = (o.material?.name || "").toLowerCase();
    if (matName.includes("joint")) {
      color = "#0E0E10"; // boots / accents
      roughness = 0.4;
    } else if (matName.includes("surface") || matName.includes("beta")) {
      // The whole body shares one material — split into a kit by cloning per region
      // Since we can't easily split, give it the jersey red as the dominant color.
      color = "#E63946";
    }

    if (o.material) {
      o.material = o.material.clone();
      o.material.color = new THREE.Color(color);
      o.material.roughness = roughness;
      o.material.metalness = metalness;
      o.material.needsUpdate = true;
    }
  });
}

// Overlay meshes that paint the kit on top of the Xbot rig.
// Xbot is ~1.8m tall and stands on the ground (feet at y=0).
function KitOverlay() {
  return (
    <group>
      {/* Shorts — white block around hips/upper thighs */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.46, 0.3, 0.32]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.7} />
      </mesh>
      {/* Boots — black caps over each foot */}
      <mesh position={[-0.11, 0.045, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.09, 0.28]} />
        <meshStandardMaterial color="#0E0E10" roughness={0.35} metalness={0.25} />
      </mesh>
      <mesh position={[0.11, 0.045, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.09, 0.28]} />
        <meshStandardMaterial color="#0E0E10" roughness={0.35} metalness={0.25} />
      </mesh>
    </group>
  );
}

function Player({ anim }: { anim: AnimName }) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(MODEL_URL) as any;
  const { actions, names } = useAnimations(animations, group);

  // Apply kit colors
  useEffect(() => {
    applyKit(scene);
  }, [scene]);

  // Xbot animations: "idle", "walk", "run", "dance", "death", "no", "sitting",
  // "standing", "yes", "wave", "punch", "ThumbsUp"
  useEffect(() => {
    if (!actions || names.length === 0) return;
    Object.values(actions).forEach((a: any) => a?.fadeOut(0.25));

    const pick = (...candidates: string[]) =>
      candidates.find((c) => names.some((n) => n.toLowerCase() === c.toLowerCase())) ||
      names[0];

    const map: Record<AnimName, string> = {
      idle: pick("idle"),
      walk: pick("walk", "walking"),
      run: pick("run", "running"),
      auto: pick("idle"),
    };
    const target = map[anim];
    const action = actions[target] || actions[names[0]];
    if (action) {
      action.reset().fadeIn(0.3).play();
    }
  }, [anim, actions, names]);

  // Auto-rotate when in "auto" mode
  useFrame((_, delta) => {
    if (!group.current) return;
    if (anim === "auto") {
      group.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={group} dispose={null} position={[0, 0, 0]}>
      <primitive object={scene} scale={1.25} />
    </group>
  );
}

function Stage() {
  return (
    <>
      {/* Pitch-style circular ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#0C1420" roughness={1} />
      </mesh>
      {/* Subtle grass tint ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[2.6, 3.1, 64]} />
        <meshBasicMaterial color="#1A6B2E" transparent opacity={0.25} />
      </mesh>
      <gridHelper args={[6.4, 16, "#1A2E42", "#13212F"]} position={[0, 0.002, 0]} />
    </>
  );
}

function Scene({ anim }: { anim: AnimName }) {
  return (
    <>
      <color attach="background" args={["#060A0F"]} />
      <fog attach="fog" args={["#060A0F", 7, 16]} />

      {/* Cinematic 3-point lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      {/* Rim light (cool) */}
      <directionalLight position={[-5, 4, -3]} intensity={0.7} color="#3DB8FF" />
      {/* Accent ground bounce */}
      <pointLight position={[0, 0.6, 3]} intensity={0.5} color="#00E676" />

      <Suspense fallback={null}>
        <Player anim={anim} />
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.7}
          scale={6}
          blur={2.4}
          far={3}
        />
        <Environment preset="city" />
      </Suspense>

      <Stage />

      <OrbitControls
        enablePan={false}
        minDistance={2.4}
        maxDistance={7}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.1, 0]}
      />
    </>
  );
}

const ACTIONS: { id: AnimName; label: string }[] = [
  { id: "idle", label: "▶ Idle" },
  { id: "walk", label: "🚶 Walk" },
  { id: "run", label: "🏃 Run" },
  { id: "auto", label: "360° AUTO" },
];

export default function Avatar3D() {
  const [anim, setAnim] = useState<AnimName>("idle");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full">
      <div className="relative w-full h-[520px] bg-gradient-to-b from-[#0C1420] to-[#060A0F] rounded-xl overflow-hidden border border-[#1A2E42]">
        {mounted ? (
          <Canvas
            shadows
            camera={{ position: [2.8, 1.9, 3.6], fov: 32 }}
            dpr={[1, 2]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Scene anim={anim} />
          </Canvas>
        ) : (
          <div className="w-full h-full grid place-items-center text-[#7A9BB5] text-xs font-[Barlow_Condensed] tracking-widest">
            LOADING 3D AVATAR…
          </div>
        )}

        <div className="pointer-events-none absolute top-4 left-4 text-[10px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed]">
          HEIGHT 180 CM · WINGSPAN 182 CM
        </div>
        <div className="pointer-events-none absolute top-4 right-4 text-right">
          <div className="text-[10px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed]">
            HEADING
          </div>
          <div className="text-[#FFD700]">★★★★☆</div>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 text-[10px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed]">
          BUILD: ATHLETIC
          <br />
          DOMINANT FOOT: RIGHT
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] tracking-widest text-[#00E676] font-[JetBrains_Mono]">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAnim(a.id)}
            className={`px-3 py-1.5 text-xs font-[Barlow_Condensed] tracking-wider rounded-md border ${
              anim === a.id
                ? "bg-[#00E676] text-[#060A0F] border-[#00E676]"
                : "border-[#1A2E42] text-[#7A9BB5] hover:text-white hover:border-[#3D5468]"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
