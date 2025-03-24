import WebAudioRenderer from '@elemaudio/web-renderer'
import {
  Canvas,
  extend,
  ThreeElement,
  useFrame,
  useThree,
} from '@react-three/fiber'
import {
  Children,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { HalfFloatType, OrthographicCamera, RenderTarget, Vector2 } from 'three'
import { Fn, pass, texture } from 'three/tsl'
import { PostProcessing, QuadMesh, WebGPURenderer } from 'three/webgpu'
import SceneBuilder from '../builders/SceneBuilder'
import { AsemicContext } from '../util/asemicContext'
import { SettingsInput, useBuilderEvents, useEvents } from '../util/useEvents'
import { el } from '@elemaudio/core'
import Toggle from '../util/Toggle'
import { log } from 'console'

extend({
  QuadMesh,
})

declare module '@react-three/fiber' {
  interface ThreeElements {
    quadMesh: ThreeElement<typeof QuadMesh>
  }
}

export function AsemicCanvas({
  children,
  className,
  dimensions: [width, height] = ['100%', '100%'],
  style,
  outputChannel = 0,
  useAudio = false,
  highBitDepth = true,
  ...settings
}: {
  className?: string
  dimensions?: [number | string, number | string]
  style?: React.CSSProperties
  useAudio?: boolean
  outputChannel?: number | ((ctx: AudioContext) => number)
  highBitDepth?: boolean
} & Partial<SceneBuilder['sceneSettings']> &
  React.PropsWithChildren) {
  const [audio, setAudio] = useState<SceneBuilder['audio']>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const [started, setStarted] = useState(!useAudio ? true : false)
  // const [recording, setRecording] = useState(false)
  const [frameloop, setFrameloop] = useState<'never' | 'always'>('never')
  const coords: [number, number][] = []

  useEffect(() => {
    return () => {
      audio?.ctx.close()
    }
  }, [audio])

  useEffect(() => {
    if (!started) {
      audio?.ctx.suspend()
    } else {
      audio?.ctx.resume()
    }
  }, [started])

  const [scene, setScene] = useState(0)

  const initAudio = async () => {
    const ctx = new AudioContext()

    const elCore = new WebAudioRenderer()
    const elNode = await elCore.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 2,
      outputChannelCount: [1, 1],
    })
    const channelMerger = ctx.createChannelMerger(
      ctx.destination.maxChannelCount,
    )
    ctx.destination.channelCount = ctx.destination.maxChannelCount
    ctx.destination.channelCountMode = 'explicit'
    ctx.destination.channelInterpretation = 'discrete'

    channelMerger.connect(ctx.destination)
    const chan =
      typeof outputChannel === 'function' ? outputChannel(ctx) : outputChannel

    elNode.connect(channelMerger, 0, chan)
    elNode.connect(channelMerger, 1, chan + 1)
    setAudio({ ctx, elNode, elCore })
    setStarted(true)
  }

  // test change
  return (
    <div
      className={`relative ${className}`}
      style={{ height, width, ...style }}
    >
      {useAudio && (
        <Toggle
          label='pause'
          cb={(state) => {
            if (state && !audio) {
              initAudio()
            } else setStarted(state)
          }}
        ></Toggle>
      )}
      {/* @ts-ignore */}
      <Canvas
        onClick={(ev) => {
          setScene((scene + 1) % Children.count(children))
          if (ev.shiftKey) {
            coords.splice(0, coords.length - 1)
          } else if (ev.metaKey) {
            coords.splice(0, coords.length)
          }
          coords.push([
            ev.clientX / canvasRef.current.clientWidth,
            (canvasRef.current.clientHeight - ev.clientY) /
              canvasRef.current.clientHeight,
          ])
          navigator.clipboard.writeText(
            coords
              .map((x) => `[${x[0].toFixed(2)}, ${x[1].toFixed(2)}]`)
              .join(', '),
          )
          console.log(
            coords
              .map((x) => `${x[0].toFixed(2)}, ${x[1].toFixed(2)}`)
              .join(', '),
          )
        }}
        ref={canvasRef}
        frameloop={frameloop}
        className={className}
        orthographic
        camera={{
          near: 0,
          far: 1,
          left: 0,
          right: 1,
          top: 1,
          bottom: 0,
          position: [0, 0, 0],
        }}
        gl={(canvas) => {
          const renderer = new WebGPURenderer({
            canvas: canvas as HTMLCanvasElement,
            powerPreference: 'high-performance',
            antialias: true,
            depth: false,
            stencil: false,
            alpha: true,
          })

          if (highBitDepth) {
            renderer.backend.utils.getPreferredCanvasFormat = () => {
              return 'rgba16float'
            }
          }

          Promise.all([renderer.init()]).then(async (result) => {
            if (highBitDepth) {
              const context = renderer.getContext()
              context.configure({
                device: renderer.backend.device,
                format: renderer.backend.utils.getPreferredCanvasFormat(),
              })
            }
            setFrameloop('always')
          })
          return renderer
        }}
      >
        {started && frameloop === 'always' && (audio || !useAudio) && (
          <AsemicContext.Provider value={{ audio }}>
            <Asemic {...settings} />
          </AsemicContext.Provider>
        )}
        {frameloop === 'always' && <Adjust />}
      </Canvas>
    </div>
  )
}

function Adjust() {
  const size = useThree((state) => state.size)
  const camera = useThree((state) => state.camera as OrthographicCamera)
  useEffect(() => {
    camera.top = size.height / size.width
    camera.updateProjectionMatrix()
  }, [size])
  return <></>
}

function Asemic<T extends SettingsInput>({
  ...settings
}: {
  controls?: T
} & Partial<SceneBuilder['sceneSettings']> = {}) {
  const { renderer, scene, camera } = useThree(({ gl, scene, camera }) => ({
    // @ts-expect-error
    renderer: gl as WebGPURenderer,
    scene,
    camera,
  }))

  const { audio } = useContext(AsemicContext)
  const size = useThree((state) => state.gl.getDrawingBufferSize(new Vector2()))

  const h = size.height / size.width
  const b = useMemo(
    () =>
      new SceneBuilder(settings, {
        postProcessing: { postProcessing, scenePass, readback },
        audio,
        h,
        size,
        renderer,
        scene,
      }),
    [],
  )

  useEffect(() => {
    b.h = h
    b.size = size
  }, [h, size])

  let phase = true

  useFrame(({ clock }) => {
    if (b.sceneSettings.useReadback) {
      phase = !phase
      postProcessing.renderer.setRenderTarget(
        phase ? renderTarget : renderTarget2,
      )
      postProcessing.render()
      postProcessing.renderer.setRenderTarget(null)
      postProcessing.render()
      readback.value = phase ? renderTarget.texture : renderTarget2.texture
      readback.needsUpdate = true
    } else {
      postProcessing.render()
    }
    b.groups.forEach((g) => g.frame(clock.elapsedTime))
  }, 1)

  // # AUDIO ----

  const renderAudio = () => {
    if (!b.audio || !b.sceneSettings.audio) return
    const render = b.sceneSettings.audio(el)
    if (render instanceof Array) b.audio.elCore.render(...render)
    else b.audio.elCore.render(render, render)
  }

  useEffect(() => {
    renderAudio()
    return () => {
      console.log('disposing', b.groups)
      b.scene.clear()
    }
  }, [b])

  return <></>
}
