import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

type AnimName = "idle" | "sprint" | "kick" | "jump" | "auto";

function Player({ anim, jerseyColor = "#C8102E", skin = "#D4956A", number = "9" }: { anim: AnimName; jerseyColor?: string; skin?: string; number?: string }) {
  const root = useRef<THREE.Group>(null!);
  const lUpperLeg = useRef<THREE.Group>(null!);
  const rUpperLeg = useRef<THREE.Group>(null!);
  const lLowerLeg = useRef<THREE.Group>(null!);
  const rLowerLeg = useRef<THREE.Group>(null!);
  const lUpperArm = useRef<THREE.Group>(null!);
  const rUpperArm = useRef<THREE.Group>(null!);
  const lLowerArm = useRef<THREE.Group>(null!);
  const rLowerArm = useRef<THREE.Group>(null!);
  const torso = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const ball = useRef<THREE.Mesh>(null!);

  // Number texture for jersey
  const numberTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = jerseyColor;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 180px Bebas Neue, Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number, 128, 140);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [jerseyColor, number]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Reset rotations baseline
    const reset = (g: THREE.Group | null) => g && g.rotation.set(0, 0, 0);
    [lUpperLeg, rUpperLeg, lLowerLeg, rLowerLeg, lUpperArm, rUpperArm, lLowerArm, rLowerArm, torso, head].forEach((r) => reset(r.current));
    if (root.current) {
      root.current.position.y = 0;
      if (anim !== "auto") root.current.rotation.y = 0;
    }
    if (ball.current) ball.current.visible = false;

    if (anim === "idle") {
      const s = Math.sin(t * 1.6) * 0.05;
      torso.current.rotation.x = s;
      head.current.rotation.y = Math.sin(t * 0.6) * 0.2;
      lUpperArm.current.rotation.x = Math.sin(t * 1.6) * 0.08;
      rUpperArm.current.rotation.x = -Math.sin(t * 1.6) * 0.08;
      root.current.position.y = Math.abs(Math.sin(t * 1.6)) * 0.02;
    } else if (anim === "sprint") {
      const sp = t * 9;
      lUpperLeg.current.rotation.x = Math.sin(sp) * 0.9;
      rUpperLeg.current.rotation.x = -Math.sin(sp) * 0.9;
      lLowerLeg.current.rotation.x = Math.max(0, Math.sin(sp + 1.2)) * 1.2;
      rLowerLeg.current.rotation.x = Math.max(0, -Math.sin(sp + 1.2)) * 1.2;
      lUpperArm.current.rotation.x = -Math.sin(sp) * 1.1;
      rUpperArm.current.rotation.x = Math.sin(sp) * 1.1;
      lLowerArm.current.rotation.x = 0.8;
      rLowerArm.current.rotation.x = 0.8;
      torso.current.rotation.x = 0.25;
      root.current.position.y = Math.abs(Math.sin(sp * 2)) * 0.05;
    } else if (anim === "kick") {
      const phase = (t % 1.6) / 1.6;
      const wind = Math.min(phase / 0.4, 1);
      const swing = phase > 0.4 ? Math.min((phase - 0.4) / 0.3, 1) : 0;
      // plant left, kick right
      rUpperLeg.current.rotation.x = -1.2 * wind + 1.4 * swing;
      rLowerLeg.current.rotation.x = 1.6 * wind - 0.8 * swing;
      lUpperLeg.current.rotation.x = -0.1;
      lUpperArm.current.rotation.x = 1.0 * wind;
      rUpperArm.current.rotation.x = -0.6 * wind;
      torso.current.rotation.x = 0.2 * wind - 0.15 * swing;
      torso.current.rotation.y = -0.2 * wind + 0.3 * swing;
      if (ball.current) {
        ball.current.visible = true;
        const bx = 0.45;
        const traveled = Math.max(0, (phase - 0.55) / 0.45);
        ball.current.position.set(bx + traveled * 2.5, 0.15 + traveled * 0.6 - traveled * traveled * 0.7, 0.1);
        ball.current.rotation.x = traveled * 12;
      }
    } else if (anim === "jump") {
      const phase = (t % 1.4) / 1.4;
      const crouch = phase < 0.25 ? phase / 0.25 : 0;
      const air = phase >= 0.25 && phase < 0.85 ? Math.sin(((phase - 0.25) / 0.6) * Math.PI) : 0;
      lUpperLeg.current.rotation.x = -0.8 * crouch + 0.3 * air;
      rUpperLeg.current.rotation.x = -0.8 * crouch + 0.3 * air;
      lLowerLeg.current.rotation.x = 1.4 * crouch + 0.4 * air;
      rLowerLeg.current.rotation.x = 1.4 * crouch + 0.4 * air;
      lUpperArm.current.rotation.x = -2.4 * air - 0.4 * crouch;
      rUpperArm.current.rotation.x = -2.4 * air - 0.4 * crouch;
      torso.current.rotation.x = -0.2 * crouch + 0.1 * air;
      root.current.position.y = air * 0.9 - crouch * 0.15;
    } else if (anim === "auto") {
      root.current.rotation.y += delta * 0.6;
      const s = Math.sin(t * 1.6) * 0.05;
      torso.current.rotation.x = s;
      lUpperArm.current.rotation.x = Math.sin(t * 1.6) * 0.08;
      rUpperArm.current.rotation.x = -Math.sin(t * 1.6) * 0.08;
    }
  });

  const skinMat = <meshStandardMaterial color={skin} roughness={0.7} />;
  const jerseyMat = <meshStandardMaterial color={jerseyColor} roughness={0.6} />;
  const shortMat = <meshStandardMaterial color="#0C1420" roughness={0.7} />;
  const sockMat = <meshStandardMaterial color={jerseyColor} roughness={0.7} />;
  const bootMat = <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.2} />;

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* Hips/torso anchor */}
      <group position={[0, 1.05, 0]}>
        <group ref={torso}>
          {/* Torso */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.55, 0.7, 0.32]} />
            {jerseyMat}
          </mesh>
          {/* Number plate (front) */}
          <mesh position={[0, 0.32, 0.165]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial map={numberTex} />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.1, 16]} />
            {skinMat}
          </mesh>
          {/* Head */}
          <group ref={head} position={[0, 0.92, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.18, 24, 24]} />
              {skinMat}
            </mesh>
            {/* Hair */}
            <mesh position={[0, 0.07, -0.02]}>
              <sphereGeometry args={[0.185, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
              <meshStandardMaterial color="#1a1208" roughness={0.9} />
            </mesh>
          </group>

          {/* Left arm */}
          <group ref={lUpperArm} position={[-0.32, 0.6, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
              {jerseyMat}
            </mesh>
            <group ref={lLowerArm} position={[0, -0.42, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <capsuleGeometry args={[0.06, 0.3, 6, 12]} />
                {skinMat}
              </mesh>
            </group>
          </group>
          {/* Right arm */}
          <group ref={rUpperArm} position={[0.32, 0.6, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
              {jerseyMat}
            </mesh>
            <group ref={rLowerArm} position={[0, -0.42, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <capsuleGeometry args={[0.06, 0.3, 6, 12]} />
                {skinMat}
              </mesh>
            </group>
          </group>
        </group>

        {/* Shorts */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <boxGeometry args={[0.5, 0.28, 0.32]} />
          {shortMat}
        </mesh>

        {/* Left leg */}
        <group ref={lUpperLeg} position={[-0.13, -0.2, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.4, 6, 12]} />
            {skinMat}
          </mesh>
          <group ref={lLowerLeg} position={[0, -0.55, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.36, 6, 12]} />
              {sockMat}
            </mesh>
            <mesh position={[0, -0.46, 0.06]} castShadow>
              <boxGeometry args={[0.12, 0.07, 0.24]} />
              {bootMat}
            </mesh>
          </group>
        </group>
        {/* Right leg */}
        <group ref={rUpperLeg} position={[0.13, -0.2, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.4, 6, 12]} />
            {skinMat}
          </mesh>
          <group ref={rLowerLeg} position={[0, -0.55, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.36, 6, 12]} />
              {sockMat}
            </mesh>
            <mesh position={[0, -0.46, 0.06]} castShadow>
              <boxGeometry args={[0.12, 0.07, 0.24]} />
              {bootMat}
            </mesh>
          </group>
        </group>
      </group>

      {/* Ball (only visible during kick) */}
      <mesh ref={ball} position={[0.45, 0.15, 0.1]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Scene({ anim }: { anim: AnimName }) {
  return (
    <>
      <color attach="background" args={["#060A0F"]} />
      <fog attach="fog" args={["#060A0F", 6, 14]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#3DB8FF" />
      <pointLight position={[0, 1, 3]} intensity={0.6} color="#00E676" />

      <Suspense fallback={null}>
        <Player anim={anim} />
        <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={6} blur={2.6} far={3} />
        <Environment preset="city" />
      </Suspense>

      {/* Ground grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial color="#0C1420" roughness={1} />
      </mesh>
      <gridHelper args={[6, 12, "#1A2E42", "#1A2E42"]} position={[0, 0.002, 0]} />

      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.1, 0]}
      />
    </>
  );
}

const ACTIONS: { id: AnimName; label: string }[] = [
  { id: "idle", label: "▶ Idle" },
  { id: "sprint", label: "🏃 Sprint" },
  { id: "kick", label: "⚽ Kick" },
  { id: "jump", label: "↕ Jump" },
  { id: "auto", label: "360° AUTO" },
];

export default function Avatar3D() {
  const [anim, setAnim] = useState<AnimName>("idle");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full">
      <div className="relative w-full h-[480px] bg-gradient-to-b from-[#0C1420] to-[#060A0F] rounded-xl overflow-hidden border border-[#1A2E42]">
        {mounted ? (
          <Canvas shadows camera={{ position: [2.6, 1.7, 3.2], fov: 35 }} dpr={[1, 2]}>
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
          <div className="text-[10px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed]">HEADING</div>
          <div className="text-[#FFD700]">★★★★☆</div>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 text-[10px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed]">
          BUILD: ATHLETIC<br />DOMINANT FOOT: RIGHT
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] tracking-widest text-[#00E676] font-[JetBrains_Mono]">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setAnim("idle")}
          className="px-3 py-1.5 text-xs font-[Barlow_Condensed] tracking-wider rounded-md border border-[#1A2E42] text-[#7A9BB5] hover:text-white hover:border-[#3D5468]"
        >
          ↩ Reset
        </button>
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
