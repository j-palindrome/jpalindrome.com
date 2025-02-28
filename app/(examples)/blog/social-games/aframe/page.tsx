'use client'

import { GroupBuilder } from '@/libs/asemic/src/builders/GroupBuilder'
import { SceneBuilder } from '@/libs/asemic/src/builders/SceneBuilder'
import { curveThree } from '@/libs/asemic/src/util/useControlPoints'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  float,
  Fn,
  pass,
  PI2,
  rotateUV,
  select,
  texture,
  varying,
  vec2,
  vec4,
  vertexIndex,
} from 'three/tsl'
import {
  MeshBasicNodeMaterial,
  PostProcessing,
  WebGPURenderer,
} from 'three/webgpu'

export default function Page() {
  const canvasRef = useRef(null!)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1)
    camera.position.set(0, 0, 0)
    camera.updateProjectionMatrix()

    const renderer = new WebGPURenderer({
      canvas: canvasRef.current,
      powerPreference: 'high-performance',
      antialias: true,
      depth: false,
      stencil: false,
      alpha: true,
    })

    renderer.init().then(() => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      const size = renderer.getDrawingBufferSize(new THREE.Vector2())

      const renderTarget = new THREE.RenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType,
      })
      const renderTarget2 = new THREE.RenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType,
      })
      const readback = texture(renderTarget.texture)

      const postProcessing = new PostProcessing(renderer)
      const scenePass = pass(scene, camera)

      const h = size.height / size.width
      const b = new SceneBuilder(
        {},
        {
          postProcessing: { postProcessing, scenePass, readback },
          audio: null,
          h,
          size,
        },
        { constants: {}, uniforms: {}, refs: {} },
      )

      b.h = h
      b.size = size

      // useBuilderEvents(b);

      postProcessing.outputNode = Fn(() => {
        const output = b.sceneSettings
          .postProcessing(scenePass.getTextureNode('output') as any, {
            scenePass,
            readback,
          })
          .toVar('outputAssign')
        return output
      })()

      let phase = true

      const geo2 = new THREE.BufferGeometry()
      geo2.setAttribute(
        'position',
        new THREE.BufferAttribute(
          new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0]),
          3,
        ),
      )
      const mat2 = new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
      })
      scene.add(new THREE.Mesh(geo2, mat2))

      const builder = new GroupBuilder(
        'line',
        {
          onInit: (g) => {
            g.clear()
            g.newCurve([0, 0], [1, 1])
          },
        },
        {},
      )

      const { getBezier, instancesPerCurve } = curveThree(builder, {
        gl: renderer,
      })
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
      const indexGuide = [0, 1, 2, 1, 2, 3]

      let currentIndex = 0
      const indexes: number[] = []

      for (let i = 0; i < builder.settings.maxCurves; i++) {
        if (builder.settings.adjustEnds === 'loop') {
          const curveStart = currentIndex
          for (let i = 0; i < instancesPerCurve - 2; i++) {
            indexes.push(...indexGuide.map((x) => x + currentIndex))
            currentIndex += 2
          }
          indexes.push(
            currentIndex,
            currentIndex + 1,
            curveStart,
            currentIndex + 1,
            curveStart,
            curveStart + 1,
          )
          currentIndex += 2
        } else {
          for (let i = 0; i < instancesPerCurve - 1; i++) {
            indexes.push(...indexGuide.map((x) => x + currentIndex))
            currentIndex += 2
          }
        }
        currentIndex += 2
      }
      geometry.setIndex(indexes)

      const material = new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
      })
      // material.mrtNode = builder.settings.renderTargets

      const position = vec2().toVar('thisPosition')
      const rotation = float(0).toVar('rotation')
      const thickness = float(0).toVar('thickness')
      const color = varying(vec4(), 'color')
      const progress = varying(float(), 'progress')
      const vUv = varying(vec2(), 'vUv')

      const main = Fn(() => {
        getBezier(
          vertexIndex
            .div(2)
            .toFloat()
            .div(instancesPerCurve - 0.001),
          position,
          {
            rotation,
            thickness,
            color,
            progress,
          },
        )

        vUv.assign(
          vec2(
            vertexIndex.div(2).toFloat().div(instancesPerCurve),
            select(vertexIndex.modInt(2).equal(0), 0, 1),
          ),
        )

        // thickness.assign(0.1)
        position.addAssign(
          rotateUV(
            vec2(
              thickness.mul(select(vertexIndex.modInt(2).equal(0), -0.5, 0.5)),
              0,
            ),
            rotation.add(PI2.mul(0.25)),
            vec2(0, 0),
          ),
        )
        return vec4(position, 0, 1)
      })

      // material.positionNode = main()
      material.positionNode = vec2(
        vertexIndex
          .toFloat()
          .div(instancesPerCurve)
          .add(select(vertexIndex.modInt(2).equal(0), 0.1, 0)),
      )

      material.colorNode = Fn(
        () => vec4(1, 1, 1, 1),
        // builder.settings.pointColor(varying(vec4(), 'color'), {
        //   progress,
        //   builder,
        //   uv: vUv,
        // }),
      )()

      material.needsUpdate = true
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // const destroy = () => {
      //   scene.remove(mesh)
      //   material.dispose()
      //   geometry.dispose()
      // }

      function animate() {
        renderer.render(scene, camera)
        // console.log('animating')

        // // renderer.render(scene, camera)
        // if (b.sceneSettings.useReadback) {
        //   phase = !phase
        //   postProcessing.renderer.setRenderTarget(
        //     phase ? renderTarget : renderTarget2,
        //   )
        //   postProcessing.render()
        //   postProcessing.renderer.setRenderTarget(null)
        //   postProcessing.render()
        //   readback.value = phase ? renderTarget.texture : renderTarget2.texture
        //   readback.needsUpdate = true
        // } else {
        //   postProcessing.render()
        // }
      }

      renderer.setAnimationLoop(animate)
    })
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} className='h-screen w-screen' />
    </div>
  )
}
