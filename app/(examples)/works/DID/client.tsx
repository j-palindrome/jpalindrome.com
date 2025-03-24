'use client'

import { Physics, useSphere } from '@react-three/cannon'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  StreamVideoParticipant,
  useCall,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk'
import { useEffect, useRef, useState } from 'react'
import { DoubleSide, Vector3, VideoTexture } from 'three'
import { callId } from './env'

export default function Client({ apiKey }) {
  const user: User = { id: '!anon', type: 'anonymous' }
  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user,
  })

  const call = client.call('livestream', callId)

  return (
    <StreamTheme style={{ fontFamily: 'sans-serif', color: 'black' }}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <Scene />
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  )
}

const Scene = () => {
  const call = useCall()
  const [started, setStarted] = useState<false | AudioContext>(false)
  const { useParticipants, useCallState } = useCallStateHooks()
  const participants = useParticipants()
  useEffect(() => {
    if (!started) return
    call?.join()
    return () => {
      call?.leave()
    }
  }, [started])

  const [videoTextures, setVideoTextures] = useState<
    Record<string, VideoTexture | null>
  >({})

  console.log('videos:', videoTextures, 'participants', participants)

  return (
    <>
      {!started ? (
        <div
          className='fixed left-0 top-0 h-screen w-screen'
          onClick={async () => {
            // Request audio playback permission
            const audioContext = new window.AudioContext()
            // Just creating the AudioContext is enough to trigger the permission prompt
            // For Safari, we need to try to play something
            if (audioContext.state === 'suspended') {
              await audioContext.resume()
              // Create a brief silent sound to unlock audio on iOS
              const silentSound = audioContext.createOscillator()
              const gainNode = audioContext.createGain()
              gainNode.gain.value = 0
              silentSound.connect(gainNode)
              gainNode.connect(audioContext.destination)
              silentSound.start()
              silentSound.stop(audioContext.currentTime + 0.01)
            }
            setStarted(audioContext)
          }}
        >
          CLICK TO START
        </div>
      ) : (
        <>
          {participants.map((participant) => (
            <Participant
              participant={participant}
              key={participant.sessionId}
              setVideoTexture={(tex) => {
                setVideoTextures((textures) => ({
                  ...textures,
                  [participant.sessionId]: tex,
                }))
              }}
            />
          ))}
          <div className='fixed h-screen w-screen bg-white'>
            <KeyboardControls
              map={[
                { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
                { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
                { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
              ]}
            >
              <Canvas>
                <PointerLockControls />
                <Physics gravity={[0, 0, 0]}>
                  <Player />
                </Physics>
                {Object.entries(videoTextures).map(([name, tex], i) => {
                  return (
                    <mesh
                      key={name}
                      scale={[5, 5, 1]}
                      position={new Vector3(0, 0, -7).applyAxisAngle(
                        new Vector3(0, 1, 0),
                        (Math.PI * 2 * i) / 4,
                      )}
                      rotation={[0, (Math.PI * 2 * i) / 4, 0]}
                    >
                      <meshBasicMaterial map={tex} side={DoubleSide} />
                      <planeGeometry args={[2, 1, 1, 1]} />
                    </mesh>
                  )
                })}
              </Canvas>
            </KeyboardControls>
          </div>
        </>
      )}
    </>
  )
}

const usePlayerControls = () => {
  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    ArrowUp: 'forward',
    ArrowDown: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  }
  const moveFieldByKey = (key) => keys[key]

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return movement
}

function Player() {
  const direction = new Vector3()
  const frontVector = new Vector3()
  const sideVector = new Vector3()
  const speed = new Vector3()
  const SPEED = 5

  const { camera } = useThree()

  const [ref, api] = useSphere((index) => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 0, 0],
  }))

  const { forward, backward, left, right, jump } = usePlayerControls()
  const velocity = useRef([0, 0, 0])
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])

  useFrame((state) => {
    ref.current.getWorldPosition(camera.position)
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)
    speed.fromArray(velocity.current)

    api.velocity.set(direction.x, velocity.current[1], direction.z)
  })

  return <></>
}

const Participant = ({
  participant,
  setVideoTexture,
}: {
  participant: StreamVideoParticipant
  setVideoTexture: (videoTexture: VideoTexture) => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current) {
      setVideoTexture(new VideoTexture(videoRef.current))
    }
  }, [videoRef.current])

  return (
    <ParticipantView
      participant={participant}
      className='fixed left-0 top-0 w-[720px]'
      ParticipantViewUI={null}
      refs={{
        setVideoElement: (el) => {
          videoRef.current = el
        },
      }}
    />
  )
}
