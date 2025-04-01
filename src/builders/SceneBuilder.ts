import { el as elementary, ElemNode } from '@elemaudio/core'
import WebAudioRenderer from '@elemaudio/web-renderer'
import { Scene, Vector2 } from 'three'
import { pass, ShaderNodeObject, texture } from 'three/tsl'
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

type BuilderGlobals = Pick<
  SceneBuilder,
  'postProcessing' | 'audio' | 'h' | 'size' | 'renderer' | 'scene'
>

export default class SceneBuilder extends Builder {
  // groups: GroupBuilder<any>[] = []
  mouse = new Vector2()
  click = new Vector2()
  text = ''
  keys: string[] = []
  postProcessing: {
    postProcessing: PostProcessing
    scenePass: ReturnType<typeof pass>
    readback: ReturnType<typeof texture> | null
  }
  renderer: WebGPURenderer
  scene: Scene
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
    postProcessing: (input) => input,
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

  constructor(
    sceneSettings: Partial<SceneBuilder['sceneSettings']>,
    globals: BuilderGlobals,
  ) {
    super()
    Object.assign(this.sceneSettings, sceneSettings)
    Object.assign(this, globals)
    if (this.sceneSettings.onInit) this.sceneSettings.onInit(this)
  }
}
