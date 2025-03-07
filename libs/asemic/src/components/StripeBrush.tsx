import { extend, ThreeElement, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { float, Fn, select, varying, vec2, vec4, vertexIndex } from 'three/tsl'
import {
  MeshBasicNodeMaterial,
  StorageInstancedBufferAttribute,
  WebGPURenderer,
} from 'three/webgpu'
import GroupBuilder from '../builders/GroupBuilder'
import BrushBuilder from '../builders/BrushBuilder'

extend({ StorageInstancedBufferAttribute })
declare module '@react-three/fiber' {
  interface ThreeElements {
    storageInstancedBufferAttribute: ThreeElement<
      typeof StorageInstancedBufferAttribute
    >
  }
}

export class StripeBrushBuilder extends BrushBuilder<'stripe'> {
  protected getDefaultBrushSettings(): { type: 'stripe' } {
    return { type: 'stripe' }
  }
  protected onFrame() {}
  protected onDraw() {}
  protected onInit() {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
    const indexGuide = [0, 1, 2, 1, 2, 3]

    let currentIndex = 0
    const indexes: number[] = []
    for (let i = 0; i < this.settings.maxCurves; i++) {
      for (let i = 0; i < this.info.instancesPerCurve - 1; i++) {
        indexes.push(...indexGuide.map((x) => x + currentIndex))
        currentIndex += 2
      }
      currentIndex += 2
    }
    geometry.setIndex(indexes)
    console.log()

    const material = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      color: 'white',
    })
    material.mrtNode = this.settings.renderTargets

    const position = vec2().toVar('thisPosition')
    const rotation = float(0).toVar('rotation')
    const thickness = float(0).toVar('thickness')
    const color = varying(vec4(), 'color')
    const progress = varying(float(), 'progress')
    const vUv = varying(vec2(), 'vUv')

    const main = Fn(() => {
      // every 2 vertices draws from one curve
      // [0, 1, 2, 1, 2, 3] = [0, 2 -> bottom, 1, 3 -> top]
      // 0 -> 1 = 0 -> 1, 1 - 2 = 2 -> 3, 2 - 3 = 4 - 5
      const thisProgress = vertexIndex
        .toFloat()
        .div(this.info.instancesPerCurve - 0.999)
        .fract()
      const curveIndexStart = vertexIndex
        .div(this.info.instancesPerCurve)
        .mul(2)
        .add(select(vertexIndex.modInt(2).equal(0), 0, 1))

      this.info.getBezier(thisProgress.add(curveIndexStart), position, {
        rotation,
        thickness,
        color,
        progress,
      })

      vUv.assign(
        vec2(
          vertexIndex.toFloat().div(this.info.instancesPerCurve),
          select(vertexIndex.modInt(2).equal(0), 0, 1),
        ),
      )
      return vec4(position, 0, 1)
    })

    material.positionNode = main()

    material.colorNode = Fn(() =>
      this.settings.pointColor(varying(vec4(), 'color'), {
        progress,
        builder: this.group,
        uv: vUv,
      }),
    )()

    material.needsUpdate = true
    const mesh = new THREE.Mesh(geometry, material)
    Object.assign(this.info, {
      material,
      geometry,
      mesh,
    })
  }

  protected onDispose() {
    this.info.material.dispose()
    this.info.geometry.dispose()
    this.scene.remove(this.info.mesh)
  }
}

export default function StripeBrush({
  children,
  ...settings
}: BrushProps<'stripe'>) {
  // @ts-ignore
  const renderer = useThree((state) => state.gl as WebGPURenderer)
  const scene = useThree((state) => state.scene)
  const group = new GroupBuilder(children)
  const builder = new StripeBrushBuilder(settings, { renderer, group, scene })
  useFrame((state) => {
    builder.frame(state.clock.elapsedTime)
  })
  useEffect(() => {
    return () => {
      builder.dispose()
    }
  }, [builder])

  return <></>
}
