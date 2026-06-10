import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import * as THREE from 'three'

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentType = 'car' | 'pedestrian'
type AgentState = 'moving' | 'waiting' | 'stopped' | 'crossing'
type EventType = 'NORMAL_MOVE' | 'NEAR_MISS' | 'COLLISION'

interface Waypoint {
  x: number
  z: number
  isCrosswalkEdge?: boolean
}

interface AgentData {
  id: string
  type: AgentType
  pos: THREE.Vector3
  bbox: THREE.Box3
  waypoints: Waypoint[]
  waypointIndex: number
  speed: number
  state: AgentState
  collisionFlashTimer: number
  waitTimer: number
  nearMissCooldown: number
  nextLogTime: number
  color: string
  meshRef: React.RefObject<THREE.Group | null>
}

interface TelemetryRecord {
  agentId: string
  agentType: AgentType
  x: number
  y: number
  z: number
  timestamp: number
  simTime: number
  eventType: EventType
}

interface HudStats {
  fps: number
  agentCount: number
  collisionCount: number
  nearMissCount: number
  recordCount: number
  simTimeSec: number
  timeOfDay: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CAR_AGENT_COUNT = 8
const PED_AGENT_COUNT = 12
const TELEMETRY_RING_SIZE = 5000
const DAY_CYCLE_SECONDS = 60
const NEAR_MISS_DIST = 1.8
const COLLISION_DIST = 1.0
const TELEMETRY_LOG_INTERVAL = 0.5
const HUD_UPDATE_INTERVAL = 0.25
const CAR_HALF = new THREE.Vector3(0.9, 0.4, 0.45)
const PED_HALF = new THREE.Vector3(0.2, 0.8, 0.2)

const CAR_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e']
const PED_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9f43', '#a29bfe', '#fd79a8', '#00cec9',
  '#fdcb6e', '#e17055', '#74b9ff', '#55efc4']

// ─── Waypoint Routes ──────────────────────────────────────────────────────────

// Car routes: closed loops. Roads run along x=[-2,2] (N-S) and z=[-2,2] (E-W).
// Lane offsets: northbound x=+1, southbound x=-1, eastbound z=-1, westbound z=+1
const CAR_ROUTES: Waypoint[][] = [
  // Route 0: Northbound straight (x=+1, start south)
  [{ x: 1, z: 16 }, { x: 1, z: -16 }, { x: 1, z: 16 }],
  // Route 1: Southbound straight (x=-1, start north)
  [{ x: -1, z: -16 }, { x: -1, z: 16 }, { x: -1, z: -16 }],
  // Route 2: Eastbound straight (z=-1, start west)
  [{ x: -16, z: -1 }, { x: 16, z: -1 }, { x: -16, z: -1 }],
  // Route 3: Westbound straight (z=+1, start east)
  [{ x: 16, z: 1 }, { x: -16, z: 1 }, { x: 16, z: 1 }],
  // Route 4: NB then turn East (right turn)
  [{ x: 1, z: 14 }, { x: 1, z: 0 }, { x: 4, z: -1 }, { x: 14, z: -1 }, { x: 14, z: -4 }, { x: 1, z: -4 }, { x: 1, z: 14 }],
  // Route 5: SB then turn West (right turn)
  [{ x: -1, z: -14 }, { x: -1, z: 0 }, { x: -4, z: 1 }, { x: -14, z: 1 }, { x: -14, z: 4 }, { x: -1, z: 4 }, { x: -1, z: -14 }],
]

// Pedestrian routes: walk sidewalk, pause at crosswalk edge, cross
const PED_ROUTES: Waypoint[][] = [
  // Route 0: West sidewalk (x=-3), cross at south crosswalk
  [
    { x: -3, z: -14 },
    { x: -3, z: -5, isCrosswalkEdge: true },
    { x: -3, z: 5 },
    { x: -3, z: 14 },
    { x: -3, z: 5, isCrosswalkEdge: true },
    { x: -3, z: -14 },
  ],
  // Route 1: East sidewalk (x=+3), cross at north crosswalk
  [
    { x: 3, z: 14 },
    { x: 3, z: 5, isCrosswalkEdge: true },
    { x: 3, z: -5 },
    { x: 3, z: -14 },
    { x: 3, z: -5, isCrosswalkEdge: true },
    { x: 3, z: 14 },
  ],
  // Route 2: North sidewalk (z=-3), cross at east crosswalk
  [
    { x: -14, z: -3 },
    { x: -5, z: -3, isCrosswalkEdge: true },
    { x: 5, z: -3 },
    { x: 14, z: -3 },
    { x: 5, z: -3, isCrosswalkEdge: true },
    { x: -14, z: -3 },
  ],
  // Route 3: South sidewalk (z=+3), cross at west crosswalk
  [
    { x: 14, z: 3 },
    { x: 5, z: 3, isCrosswalkEdge: true },
    { x: -5, z: 3 },
    { x: -14, z: 3 },
    { x: -5, z: 3, isCrosswalkEdge: true },
    { x: 14, z: 3 },
  ],
  // Route 4: Diagonal corner walk (NW sidewalk corner)
  [
    { x: -3, z: -14 },
    { x: -3, z: -5, isCrosswalkEdge: true },
    { x: -14, z: -3 },
    { x: -3, z: -3 },
    { x: -3, z: -14 },
  ],
  // Route 5: Diagonal corner walk (SE sidewalk corner)
  [
    { x: 3, z: 14 },
    { x: 3, z: 5, isCrosswalkEdge: true },
    { x: 14, z: 3 },
    { x: 3, z: 3 },
    { x: 3, z: 14 },
  ],
]

// ─── Agent Initialisation ────────────────────────────────────────────────────

function createAgents(): AgentData[] {
  const agents: AgentData[] = []

  for (let i = 0; i < CAR_AGENT_COUNT; i++) {
    const route = CAR_ROUTES[i % CAR_ROUTES.length]
    const startIdx = Math.floor(Math.random() * route.length)
    const wp = route[startIdx]
    agents.push({
      id: `car_${String(i).padStart(3, '0')}`,
      type: 'car',
      pos: new THREE.Vector3(wp.x, 0.4, wp.z),
      bbox: new THREE.Box3(),
      waypoints: route,
      waypointIndex: startIdx,
      speed: 3 + Math.random() * 2.5,
      state: 'moving',
      collisionFlashTimer: 0,
      waitTimer: 0,
      nearMissCooldown: 0,
      nextLogTime: Math.random() * TELEMETRY_LOG_INTERVAL,
      color: CAR_COLORS[i % CAR_COLORS.length],
      meshRef: { current: null },
    })
  }

  for (let i = 0; i < PED_AGENT_COUNT; i++) {
    const route = PED_ROUTES[i % PED_ROUTES.length]
    const startIdx = Math.floor(Math.random() * route.length)
    const wp = route[startIdx]
    agents.push({
      id: `ped_${String(i).padStart(3, '0')}`,
      type: 'pedestrian',
      pos: new THREE.Vector3(wp.x, 0.8, wp.z),
      bbox: new THREE.Box3(),
      waypoints: route,
      waypointIndex: startIdx,
      speed: 0.8 + Math.random() * 0.7,
      state: 'moving',
      collisionFlashTimer: 0,
      waitTimer: 0,
      nearMissCooldown: 0,
      nextLogTime: Math.random() * TELEMETRY_LOG_INTERVAL,
      color: PED_COLORS[i % PED_COLORS.length],
      meshRef: { current: null },
    })
  }

  return agents
}

// ─── Static Environment Components ───────────────────────────────────────────

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshLambertMaterial color="#2d5a27" />
    </mesh>
  )
}

function RoadNetwork() {
  return (
    <group>
      {/* N-S road */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[4, 0.01, 48]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      {/* E-W road */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[48, 0.01, 4]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function Sidewalks() {
  const strips: [number, number, number, number, number][] = [
    // [x, z, w, d] — N-S left
    [-3, 0, 2, 28, 0],
    // N-S right
    [3, 0, 2, 28, 0],
    // E-W top
    [0, -3, 28, 2, 0],
    // E-W bottom
    [0, 3, 28, 2, 0],
  ]
  return (
    <group>
      {strips.map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.025, z]} receiveShadow>
          <boxGeometry args={[w, 0.05, d]} />
          <meshLambertMaterial color="#aaaaaa" />
        </mesh>
      ))}
    </group>
  )
}

function CrosswalkStripes() {
  const stripeCount = 5
  const stripes: { pos: [number, number, number]; rot: number }[] = []

  for (let i = 0; i < stripeCount; i++) {
    const offset = -1.6 + i * 0.8
    // North crosswalk (across N-S road at z=-4.5)
    stripes.push({ pos: [offset, 0.015, -4.5], rot: 0 })
    // South crosswalk (at z=+4.5)
    stripes.push({ pos: [offset, 0.015, 4.5], rot: 0 })
    // East crosswalk (across E-W road at x=+4.5)
    stripes.push({ pos: [4.5, 0.015, offset], rot: 1 })
    // West crosswalk (at x=-4.5)
    stripes.push({ pos: [-4.5, 0.015, offset], rot: 1 })
  }

  return (
    <group>
      {stripes.map((s, i) => (
        <mesh key={i} position={s.pos} receiveShadow>
          <boxGeometry args={s.rot === 0 ? [0.4, 0.01, 2] : [2, 0.01, 0.4]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

function LaneMarkings() {
  const marks: { pos: [number, number, number]; rot: number }[] = []
  for (let z = -20; z <= 20; z += 2.5) {
    if (Math.abs(z) < 5) continue
    marks.push({ pos: [0, 0.012, z], rot: 0 })
  }
  for (let x = -20; x <= 20; x += 2.5) {
    if (Math.abs(x) < 5) continue
    marks.push({ pos: [x, 0.012, 0], rot: 1 })
  }
  return (
    <group>
      {marks.map((m, i) => (
        <mesh key={i} position={m.pos}>
          <boxGeometry args={m.rot === 0 ? [0.1, 0.01, 1.5] : [1.5, 0.01, 0.1]} />
          <meshLambertMaterial color="#ffff00" />
        </mesh>
      ))}
    </group>
  )
}

interface BuildingProps {
  x: number
  z: number
  w: number
  d: number
  h: number
  color: string
}

function BuildingBlock({ x, z, w, d, h, color }: BuildingProps) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

function Buildings() {
  const buildings = useMemo(() => {
    const corners = [
      { cx: -12, cz: -12 },
      { cx: 12, cz: -12 },
      { cx: -12, cz: 12 },
      { cx: 12, cz: 12 },
    ]
    const colors = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad']
    const result: BuildingProps[] = []
    corners.forEach((c, ci) => {
      const numBuildings = 2 + Math.floor(ci * 0.7 + 1)
      for (let i = 0; i < numBuildings; i++) {
        result.push({
          x: c.cx + (i % 2 === 0 ? -2 : 2),
          z: c.cz + (i < 2 ? -1 : 1),
          w: 3 + (i % 3),
          d: 3 + ((i + 1) % 3),
          h: 3 + (ci * 2) + (i * 1.5),
          color: colors[ci],
        })
      }
    })
    return result
  }, [])

  return (
    <group>
      {buildings.map((b, i) => <BuildingBlock key={i} {...b} />)}
    </group>
  )
}

function TrafficLight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 3, 8]} />
        <meshLambertMaterial color="#555555" />
      </mesh>
      {/* red */}
      <mesh position={[0, 3.3, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshLambertMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
      {/* yellow */}
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshLambertMaterial color="#888800" />
      </mesh>
      {/* green */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshLambertMaterial color="#00aa00" />
      </mesh>
    </group>
  )
}

function TrafficLights() {
  return (
    <group>
      <TrafficLight x={2.5} z={-2.5} />
      <TrafficLight x={-2.5} z={2.5} />
      <TrafficLight x={2.5} z={2.5} />
      <TrafficLight x={-2.5} z={-2.5} />
    </group>
  )
}

// ─── Agent Meshes ─────────────────────────────────────────────────────────────

interface AgentMeshProps {
  color: string
  meshRef: React.RefObject<THREE.Group | null>
  initialPos: THREE.Vector3
}

function CarMesh({ color, meshRef, initialPos }: AgentMeshProps) {
  return (
    <group
      ref={meshRef}
      position={[initialPos.x, initialPos.y, initialPos.z]}
      castShadow
    >
      {/* body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.9]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.0, 0.35, 0.8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* wheels */}
      {([[-0.7, -0.2, 0.5], [0.7, -0.2, 0.5], [-0.7, -0.2, -0.5], [0.7, -0.2, -0.5]] as [number, number, number][]).map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 10]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  )
}

function PedestrianMesh({ color, meshRef, initialPos }: AgentMeshProps) {
  return (
    <group
      ref={meshRef}
      position={[initialPos.x, initialPos.y, initialPos.z]}
      castShadow
    >
      {/* torso */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.35, 0.8, 0.25]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshLambertMaterial color="#f0c8a0" />
      </mesh>
    </group>
  )
}

// ─── Day/Night Lighting ───────────────────────────────────────────────────────

interface LightingProps {
  dayTimeRef: React.RefObject<number>
  sunPosRef: React.RefObject<THREE.Vector3>
}

function DayNightLighting({ dayTimeRef, sunPosRef }: LightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null)
  const ambLightRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    const t = dayTimeRef.current ?? 0.25
    const angle = t * Math.PI * 2
    const dayFactor = Math.max(0, Math.sin(angle - Math.PI / 2))

    const sx = Math.sin(angle) * 30
    const sy = Math.cos(angle) * 30
    const sz = -15

    if (sunPosRef.current) {
      sunPosRef.current.set(sx, sy, sz)
    }

    if (dirLightRef.current) {
      dirLightRef.current.position.set(sx, sy, sz)
      dirLightRef.current.intensity = dayFactor * 1.8
    }
    if (ambLightRef.current) {
      ambLightRef.current.intensity = 0.08 + dayFactor * 0.55
    }
  })

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <ambientLight ref={ambLightRef} intensity={0.4} />
    </>
  )
}

function SunMoonMesh({ sunPosRef }: { sunPosRef: React.RefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!meshRef.current || !sunPosRef.current) return
    meshRef.current.position.copy(sunPosRef.current)
    // sun above horizon = yellow, moon below = white/grey
    const isDay = sunPosRef.current.y > 0;
    (meshRef.current.material as THREE.MeshLambertMaterial).color.set(isDay ? '#ffffaa' : '#ccccff');
    (meshRef.current.material as THREE.MeshLambertMaterial).emissive.set(isDay ? '#ffdd44' : '#8888cc')
  })
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 12, 12]} />
      <meshLambertMaterial emissiveIntensity={1.0} />
    </mesh>
  )
}

// ─── Scene Background Updater ─────────────────────────────────────────────────

function SceneBg({ dayTimeRef }: { dayTimeRef: React.RefObject<number> }) {
  const { scene } = useThree()
  useFrame(() => {
    const t = dayTimeRef.current ?? 0.25
    const angle = t * Math.PI * 2
    const dayFactor = Math.max(0, Math.sin(angle - Math.PI / 2))
    const night = new THREE.Color('#0a0a1a')
    const day = new THREE.Color('#87ceeb')
    scene.background = night.lerp(day, dayFactor)
    scene.fog = new THREE.Fog(scene.background.getHex(), 40, 90)
  })
  return null
}

// ─── Agent Layer (game loop) ──────────────────────────────────────────────────

interface AgentLayerProps {
  agentsRef: React.RefObject<AgentData[]>
  telemetryRef: React.RefObject<(TelemetryRecord | undefined)[]>
  ringHeadRef: React.RefObject<number>
  totalRecordsRef: React.RefObject<number>
  collisionCountRef: React.RefObject<number>
  nearMissCountRef: React.RefObject<number>
  simTimeRef: React.RefObject<number>
  dayTimeRef: React.RefObject<number>
  sunPosRef: React.RefObject<THREE.Vector3>
  onHudUpdate: (stats: HudStats) => void
  onEventLog: (msg: string) => void
}

function AgentLayer({
  agentsRef, telemetryRef, ringHeadRef, totalRecordsRef,
  collisionCountRef, nearMissCountRef, simTimeRef, dayTimeRef, sunPosRef,
  onHudUpdate, onEventLog,
}: AgentLayerProps) {
  const hudTimer = useRef(0)

  function logTelemetry(agent: AgentData, eventType: EventType) {
    const idx = (ringHeadRef.current ?? 0) % TELEMETRY_RING_SIZE
    telemetryRef.current[idx] = {
      agentId: agent.id,
      agentType: agent.type,
      x: parseFloat(agent.pos.x.toFixed(3)),
      y: parseFloat(agent.pos.y.toFixed(3)),
      z: parseFloat(agent.pos.z.toFixed(3)),
      timestamp: Date.now(),
      simTime: parseFloat((simTimeRef.current ?? 0).toFixed(2)),
      eventType,
    };
    (ringHeadRef as React.MutableRefObject<number>).current++;
    (totalRecordsRef as React.MutableRefObject<number>).current++
  }

  function getTimeLabel(t: number): string {
    if (t < 0.1 || t > 0.9) return 'Night'
    if (t < 0.3) return 'Dawn'
    if (t < 0.7) return 'Day'
    return 'Dusk'
  }

  useFrame((_, delta) => {
    const agents = agentsRef.current
    if (!agents) return
    const dt = Math.min(delta, 0.05);

    (simTimeRef as React.MutableRefObject<number>).current += dt;
    (dayTimeRef as React.MutableRefObject<number>).current =
      ((simTimeRef.current ?? 0) / DAY_CYCLE_SECONDS) % 1.0

    const simTime = simTimeRef.current ?? 0

    // ── Move agents ──
    for (const agent of agents) {
      const mesh = agent.meshRef.current
      if (!mesh) continue

      // Handle collision stop
      if (agent.state === 'stopped') {
        agent.collisionFlashTimer -= dt
        if (agent.collisionFlashTimer <= 0) {
          agent.state = 'moving'
          agent.collisionFlashTimer = 0
          ;(mesh.children[0] as THREE.Mesh & { material: THREE.MeshLambertMaterial })
            .material.color.set(agent.color)
        }
        agent.bbox.setFromCenterAndSize(
          agent.pos,
          agent.type === 'car' ? CAR_HALF.clone().multiplyScalar(2) : PED_HALF.clone().multiplyScalar(2)
        )
        continue
      }

      // Handle waiting at crosswalk
      if (agent.state === 'waiting') {
        agent.waitTimer -= dt
        if (agent.waitTimer <= 0) {
          agent.state = 'moving'
          agent.waitTimer = 0
        }
        agent.bbox.setFromCenterAndSize(
          agent.pos,
          agent.type === 'car' ? CAR_HALF.clone().multiplyScalar(2) : PED_HALF.clone().multiplyScalar(2)
        )
        continue
      }

      // Move toward current waypoint
      const wp = agent.waypoints[agent.waypointIndex]
      const tx = wp.x
      const tz = wp.z
      const dx = tx - agent.pos.x
      const dz = tz - agent.pos.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < 0.25) {
        // Reached waypoint — advance
        const prevIdx = agent.waypointIndex
        agent.waypointIndex = (agent.waypointIndex + 1) % agent.waypoints.length
        const nextWp = agent.waypoints[agent.waypointIndex]
        if (nextWp.isCrosswalkEdge && prevIdx !== agent.waypointIndex) {
          agent.state = 'waiting'
          agent.waitTimer = 1.2 + Math.random() * 2.0
        }
      } else {
        const nx = dx / dist
        const nz = dz / dist
        const step = agent.speed * dt
        agent.pos.x += nx * step
        agent.pos.z += nz * step
        mesh.position.set(agent.pos.x, agent.pos.y, agent.pos.z)
        // Face direction of travel
        mesh.rotation.y = Math.atan2(nx, nz)
      }

      // Update bbox
      const halfSize = agent.type === 'car' ? CAR_HALF.clone().multiplyScalar(2) : PED_HALF.clone().multiplyScalar(2)
      agent.bbox.setFromCenterAndSize(agent.pos, halfSize)

      // Normal move telemetry
      agent.nextLogTime -= dt
      if (agent.nextLogTime <= 0) {
        agent.nextLogTime = TELEMETRY_LOG_INTERVAL
        logTelemetry(agent, 'NORMAL_MOVE')
      }

      // Decrement near-miss cooldown
      if (agent.nearMissCooldown > 0) agent.nearMissCooldown -= dt
    }

    // ── Collision detection ──
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a = agents[i]
        const b = agents[j]
        if (a.state === 'stopped' && b.state === 'stopped') continue
        // Must involve at least one car and one pedestrian for meaningful collision
        const isDiffTypes = a.type !== b.type

        const dist2 = a.pos.distanceTo(b.pos)

        if (isDiffTypes && dist2 < COLLISION_DIST && a.bbox.intersectsBox(b.bbox)) {
          // Collision
          if (a.state !== 'stopped') {
            a.state = 'stopped'
            a.collisionFlashTimer = 2.5
            const mesh = a.meshRef.current
            if (mesh) (mesh.children[0] as THREE.Mesh & { material: THREE.MeshLambertMaterial }).material.color.set('#ff0000')
          }
          if (b.state !== 'stopped') {
            b.state = 'stopped'
            b.collisionFlashTimer = 2.5
            const mesh = b.meshRef.current
            if (mesh) (mesh.children[0] as THREE.Mesh & { material: THREE.MeshLambertMaterial }).material.color.set('#ff0000')
          }
          ;(collisionCountRef as React.MutableRefObject<number>).current++
          logTelemetry(a, 'COLLISION')
          logTelemetry(b, 'COLLISION')
          onEventLog(`💥 COLLISION: ${a.id} ↔ ${b.id} @ t=${simTime.toFixed(1)}s`)

        } else if (isDiffTypes && dist2 < NEAR_MISS_DIST) {
          if (a.nearMissCooldown <= 0 && b.nearMissCooldown <= 0) {
            a.nearMissCooldown = 2.0
            b.nearMissCooldown = 2.0
            ;(nearMissCountRef as React.MutableRefObject<number>).current++
            logTelemetry(a, 'NEAR_MISS')
            logTelemetry(b, 'NEAR_MISS')
            onEventLog(`⚠️ NEAR MISS: ${a.id} ↔ ${b.id} @ t=${simTime.toFixed(1)}s`)
          }
        }
      }
    }

    // ── HUD update (throttled) ──
    hudTimer.current += dt
    if (hudTimer.current >= HUD_UPDATE_INTERVAL) {
      hudTimer.current = 0
      const t = dayTimeRef.current ?? 0.25
      onHudUpdate({
        fps: Math.round(1 / delta),
        agentCount: agents.length,
        collisionCount: collisionCountRef.current ?? 0,
        nearMissCount: nearMissCountRef.current ?? 0,
        recordCount: Math.min((totalRecordsRef.current ?? 0), TELEMETRY_RING_SIZE),
        simTimeSec: simTime,
        timeOfDay: getTimeLabel(t),
      })
    }

    // Update sun/moon position for Sky component
    if (sunPosRef.current) {
      const angle = (dayTimeRef.current ?? 0.25) * Math.PI * 2
      sunPosRef.current.set(Math.sin(angle) * 30, Math.cos(angle) * 30, -15)
    }
  })

  const agents = agentsRef.current ?? []

  return (
    <group>
      {agents.map(agent =>
        agent.type === 'car' ? (
          <CarMesh
            key={agent.id}
            color={agent.color}
            meshRef={agent.meshRef}
            initialPos={agent.pos.clone()}
          />
        ) : (
          <PedestrianMesh
            key={agent.id}
            color={agent.color}
            meshRef={agent.meshRef}
            initialPos={agent.pos.clone()}
          />
        )
      )}
    </group>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CitySimulator() {
  const agentsRef = useRef<AgentData[]>([])
  const telemetryRef = useRef<(TelemetryRecord | undefined)[]>(new Array(TELEMETRY_RING_SIZE))
  const ringHeadRef = useRef(0)
  const totalRecordsRef = useRef(0)
  const collisionCountRef = useRef(0)
  const nearMissCountRef = useRef(0)
  const simTimeRef = useRef(0)
  const dayTimeRef = useRef(0.25)
  const sunPosRef = useRef(new THREE.Vector3(0, 30, -15))

  const [hudStats, setHudStats] = useState<HudStats>({
    fps: 0, agentCount: 0, collisionCount: 0, nearMissCount: 0,
    recordCount: 0, simTimeSec: 0, timeOfDay: 'Dawn',
  })
  const [eventLog, setEventLog] = useState<string[]>([])

  useEffect(() => {
    agentsRef.current = createAgents()
  }, [])

  function exportTelemetry(format: 'jsonl' | 'csv') {
    const count = Math.min(totalRecordsRef.current, TELEMETRY_RING_SIZE)
    if (count === 0) { alert('No telemetry data yet. Let the simulation run for a few seconds.'); return }
    const head = ringHeadRef.current % TELEMETRY_RING_SIZE
    const records: TelemetryRecord[] = []
    for (let i = 0; i < count; i++) {
      const idx = (head - count + i + TELEMETRY_RING_SIZE) % TELEMETRY_RING_SIZE
      const r = telemetryRef.current[idx]
      if (r) records.push(r)
    }

    let blob: Blob
    let filename: string

    if (format === 'jsonl') {
      const lines = records.map(r => JSON.stringify(r)).join('\n')
      blob = new Blob([lines], { type: 'application/jsonlines' })
      filename = `city_sim_telemetry_${Date.now()}.jsonl`
    } else {
      const header = 'agentId,agentType,x,y,z,timestamp,simTime,eventType\n'
      const rows = records.map(r =>
        `${r.agentId},${r.agentType},${r.x},${r.y},${r.z},${r.timestamp},${r.simTime},${r.eventType}`
      ).join('\n')
      blob = new Blob([header + rows], { type: 'text/csv' })
      filename = `city_sim_telemetry_${Date.now()}.csv`
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const handleEventLog = (msg: string) =>
    setEventLog(prev => [msg, ...prev].slice(0, 12))

  const hudStyle: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0,
    color: '#00ff88', fontFamily: 'monospace', fontSize: 12,
    padding: '10px 14px', pointerEvents: 'none',
    background: 'rgba(0,0,0,0.6)', borderRadius: '0 0 8px 0',
    minWidth: 200, lineHeight: 1.7,
  }
  const logStyle: React.CSSProperties = {
    position: 'absolute', bottom: 56, left: 0,
    color: '#ffdd44', fontFamily: 'monospace', fontSize: 11,
    padding: '8px 12px', pointerEvents: 'none',
    background: 'rgba(0,0,0,0.55)', borderRadius: '0 8px 0 0',
    maxWidth: 380,
  }
  const btnStyle: React.CSSProperties = {
    padding: '8px 14px', background: '#0d6efd', color: '#fff',
    border: 'none', borderRadius: 6, cursor: 'pointer',
    fontFamily: 'monospace', fontSize: 13, marginLeft: 8,
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 30, 30], fov: 50 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <OrbitControls
          minDistance={10}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2 - 0.04}
        />
        <Sky
          sunPosition={[sunPosRef.current.x, sunPosRef.current.y, sunPosRef.current.z]}
          turbidity={8}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        <SceneBg dayTimeRef={dayTimeRef} />
        <DayNightLighting dayTimeRef={dayTimeRef} sunPosRef={sunPosRef} />
        <SunMoonMesh sunPosRef={sunPosRef} />
        <Ground />
        <RoadNetwork />
        <Sidewalks />
        <CrosswalkStripes />
        <LaneMarkings />
        <Buildings />
        <TrafficLights />
        <AgentLayer
          agentsRef={agentsRef}
          telemetryRef={telemetryRef}
          ringHeadRef={ringHeadRef}
          totalRecordsRef={totalRecordsRef}
          collisionCountRef={collisionCountRef}
          nearMissCountRef={nearMissCountRef}
          simTimeRef={simTimeRef}
          dayTimeRef={dayTimeRef}
          sunPosRef={sunPosRef}
          onHudUpdate={setHudStats}
          onEventLog={handleEventLog}
        />
      </Canvas>

      {/* HUD */}
      <div style={hudStyle}>
        <div>🏙️ City Simulator</div>
        <div>FPS: {hudStats.fps}</div>
        <div>Agents: {hudStats.agentCount}</div>
        <div style={{ color: '#ff6b6b' }}>Collisions: {hudStats.collisionCount}</div>
        <div style={{ color: '#ffd93d' }}>Near Misses: {hudStats.nearMissCount}</div>
        <div>Telemetry: {hudStats.recordCount} records</div>
        <div>Sim Time: {hudStats.simTimeSec.toFixed(1)}s</div>
        <div>Time of Day: {hudStats.timeOfDay}</div>
      </div>

      {/* Event Log */}
      {eventLog.length > 0 && (
        <div style={logStyle}>
          {eventLog.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      {/* Export Buttons */}
      <div style={{ position: 'absolute', bottom: 14, right: 14, pointerEvents: 'auto' }}>
        <span style={{ color: '#aaa', fontFamily: 'monospace', fontSize: 12 }}>Export for Fabric:</span>
        <button style={btnStyle} onClick={() => exportTelemetry('jsonl')}>⬇ JSONL</button>
        <button style={{ ...btnStyle, background: '#198754' }} onClick={() => exportTelemetry('csv')}>⬇ CSV</button>
      </div>
    </div>
  )
}
