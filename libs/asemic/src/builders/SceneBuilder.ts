import { el, el as elementary, ElemNode } from '@elemaudio/core'
import WebAudioRenderer from '@elemaudio/web-renderer'
import {
  HalfFloatType,
  OrthographicCamera,
  RenderTarget,
  Scene,
  Vector2,
} from 'three'
import { Fn, pass, ShaderNodeObject, texture } from 'three/tsl'
import { PostProcessing, TextureNode } from 'three/webgpu'
import Builder from './Builder'
import BrushBuilder from './BrushBuilder'
import { WebGPURenderer } from 'three/src/Three.WebGPU.js'
import GroupBuilder from './GroupBuilder'
import { BlobBrush } from '../brushes/BlobBrush'
import { DashBrush } from '../brushes/DashBrush'
import { DotBrush } from '../brushes/DotBrush'
import { LineBrush } from '../brushes/LineBrush'
import { ParticlesBrush } from '../brushes/ParticlesBrush'
import { StripeBrush } from '../brushes/StripeBrush'
import invariant from 'tiny-invariant'

type BuilderGlobals = Pick<
  SceneBuilder,
  'postProcessing' | 'audio' | 'h' | 'size' | 'renderer' | 'scene'
>

export default class SceneBuilder extends Builder {
  // groups: GroupBuilder<any>[] = []
  phase = true
  mouse = new Vector2()
  click = new Vector2()
  text = ''
  keys: string[] = []
  postProcessing: {
    postProcessing: PostProcessing
    scenePass: ReturnType<typeof pass>
    readback: ReturnType<typeof texture> | null
    renderTargets?: [RenderTarget, RenderTarget]
  }
  renderer: WebGPURenderer
  scene: Scene
  camera: OrthographicCamera
  audio: {
    ctx: AudioContext
    elNode: AudioWorkletNode
    elCore: WebAudioRenderer
  } | null
  size: Vector2
  h: number
  groups: BrushBuilder<any>[] = []

  sceneSettings: {
    onInit?: (b: SceneBuilder) => void
    postProcessing: (
      input: ShaderNodeObject<TextureNode>,
      info: {
        scenePass: BuilderGlobals['postProcessing']['scenePass']
        readback: BuilderGlobals['postProcessing']['readback']
      },
    ) => ShaderNodeObject<any>
    audio: ((el: typeof elementary) => ElemNode | [ElemNode, ElemNode]) | null
    useReadback: boolean
  } = {
    // postProcessing: (input) => input,
    useReadback: false,
    audio: null,
  }

  newGroup<T extends BrushTypes>(
    type: T,
    onInit: (g: GroupBuilder) => void,
    settings: Partial<BrushData<T> & ProcessData<T>>,
  ) {
    const group = new GroupBuilder(onInit)
    let constructor
    switch (type) {
      case 'blob':
        constructor = BlobBrush
        break
      case 'dash':
        constructor = DashBrush
        break
      case 'dot':
        constructor = DotBrush
        break
      case 'line':
        constructor = LineBrush
        break
      case 'particles':
        constructor = ParticlesBrush
        break
      case 'stripe':
        constructor = StripeBrush
        break
    }
    this.groups.push(
      new constructor(settings ?? { type }, {
        renderer: this.renderer,
        group,
        scene: this.scene,
      }),
    )
  }

  dispose() {
    this.groups.forEach((group) => group.dispose())
  }

  constructor(
    sceneSettings: Partial<SceneBuilder['sceneSettings']>,
    canvas: HTMLCanvasElement,
  ) {
    super()
    Object.assign(this.sceneSettings, sceneSettings)

    this.scene = new Scene()
    this.renderer = new WebGPURenderer({
      canvas,
      powerPreference: 'high-performance',
      antialias: true,
      depth: false,
      stencil: false,
      alpha: true,
    })
    this.size = this.renderer.getDrawingBufferSize(new Vector2())
    this.h = this.size.y / this.size.x
    this.camera = new OrthographicCamera(0, 1, this.h, 0, 0, 1000)

    if (this.sceneSettings.audio) {
      const ctx = new AudioContext()
      const elCore = new WebAudioRenderer()
      const channelMerger = ctx.createChannelMerger(
        ctx.destination.maxChannelCount,
      )
      ctx.destination.channelCount = ctx.destination.maxChannelCount
      ctx.destination.channelCountMode = 'explicit'
      ctx.destination.channelInterpretation = 'discrete'
      channelMerger.connect(ctx.destination)
      const chan = 0

      elCore
        .initialize(ctx, {
          numberOfInputs: 0,
          numberOfOutputs: 2,
          outputChannelCount: [1, 1],
        })
        .then((elNode) => {
          elNode.connect(channelMerger, 0, chan)
          elNode.connect(channelMerger, 1, chan + 1)
        })
    }
    if (this.sceneSettings.postProcessing) {
      let readback, renderTargets
      if (this.sceneSettings.useReadback) {
        this.postProcessing.renderTargets = [
          new RenderTarget(this.size.width, this.size.height, {
            type: HalfFloatType,
          }),
          new RenderTarget(this.size.width, this.size.height, {
            type: HalfFloatType,
          }),
        ]
        readback = texture(this.postProcessing.renderTargets[0].texture)
      }
      const postProcessing = new PostProcessing(this.renderer)
      postProcessing.outputNode = Fn(() => {
        const output = this.sceneSettings
          .postProcessing(scenePass.getTextureNode('output') as any, {
            scenePass,
            readback,
          })
          .toVar('outputAssign')
        return output
      })()
      const scenePass = pass(this.scene, this.camera)
      this.postProcessing = {
        postProcessing,
        scenePass,
        readback,
        renderTargets,
      }
    }
    const renderAudio = () => {
      if (!this.sceneSettings.audio) return
      const render = this.sceneSettings.audio(el)
      if (render instanceof Array) this.audio.elCore.render(...render)
      else this.audio.elCore.render(render, render)
    }

    this.renderer.init().then(() => {
      // if (this.sceneSettings.postProcessing && this.postProcessing.readback) {
      //   invariant(this.postProcessing.renderTargets)
      //   this.renderer.setAnimationLoop((time) => {
      //     this.phase = !this.phase
      //     this.renderer.setRenderTarget(
      //       this.phase
      //         ? this.postProcessing.renderTargets[0]
      //         : this.postProcessing.renderTargets[1],
      //     )
      //     this.postProcessing.postProcessing.render()
      //     this.postProcessing.postProcessing.renderer.setRenderTarget(null)
      //     this.postProcessing.postProcessing.render()
      //     this.postProcessing.readback.value = this.phase
      //       ? this.postProcessing.renderTargets[0].texture
      //       : this.postProcessing.renderTargets[1].texture
      //     this.postProcessing.readback.needsUpdate = true
      //     this.groups.forEach((g) => g.frame(time))
      //     renderAudio()
      //   })
      // } else if (this.sceneSettings.postProcessing) {
      //   this.renderer.setAnimationLoop((time) => {
      //     this.postProcessing.postProcessing.render()
      //     this.groups.forEach((g) => g.frame(time))
      //     renderAudio()
      //   })
      // } else {

      // }

      if (this.sceneSettings.onInit) this.sceneSettings.onInit(this)

      // this.renderer.setAnimationLoop((time) => {
      //   this.groups.forEach((g) => g.frame(time))
      //   this.renderer.render(this.scene, this.camera)
      //   renderAudio()
      // })
    })
  }
}
