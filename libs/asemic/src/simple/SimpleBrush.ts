import { range } from 'lodash'
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector2,
} from 'three'
import {
  Fn,
  If,
  Loop,
  mix,
  uniformArray,
  vec2,
  vec4,
  vertexIndex,
  wgslFn,
} from 'three/tsl'
import { MeshBasicNodeMaterial, WebGPURenderer } from 'three/webgpu'

export default class SimpleBrush {
  mesh: Mesh
  geometry: BufferGeometry
  material: MeshBasicNodeMaterial
  scene: Scene
  renderer: WebGPURenderer
  size: Vector2 = new Vector2()
  curveStarts = uniformArray([], 'vec2')
  // position xy, thickness, strength
  curvePositions = uniformArray([], 'vec4')
  curveColors = uniformArray([], 'vec4')

  render(curves: Vector2[][]) {
    const indexes = new BufferAttribute(new Int16Array(curves.length * 3), 2)
    let totalInstances = 0
    const curveStarts = []
    for (let curve of curves) {
      let curveInstances = 0
      const screenWidth = this.renderer.getDrawingBufferSize(this.size).x
      for (let i = 0; i < curve.length - 1; i++) {
        curveInstances += curve[i].distanceTo(curve[i + 1])
      }
      curveInstances *= screenWidth / 2

      for (let i = totalInstances; i < curveInstances; i += 2) {
        indexes.set([i, i + 1, i + 2, i + 1, i + 2, i + 3], i * 6)
      }
      curveStarts.push(totalInstances)
      totalInstances += curveInstances + 1
    }

    this.geometry.setIndex(indexes)
  }

  constructor(scene: Scene, renderer: WebGPURenderer) {
    this.scene = scene
    this.renderer = renderer
    this.geometry = new BufferGeometry()
    this.material = new MeshBasicNodeMaterial()
    this.material.positionNode = Fn(() => {
      const position = mix(
        vec2(0, 0),
        vec2(1, 1),
        vertexIndex.toFloat().div(this.curveStarts.element(1)),
      ).toVar()
      If(vertexIndex.modInt(2).equal(0), () => {
        position.addAssign(vec2(0.1, 0))
      })
      return position
    })()
    this.material.colorNode = vec4(1, 1, 1, 1)
    this.mesh = new Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }
}
