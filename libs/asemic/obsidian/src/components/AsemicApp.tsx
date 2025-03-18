import { Asemic, AsemicCanvas } from '@asemic'
import { useEffect, useRef } from 'react'
import { HalfFloatType, OrthographicCamera, Scene, Vector2 } from 'three'
import { WebGPURenderer } from 'three/src/Three.WebGPU'
import SimpleBrush from '../../../src/simple/SimpleBrush'
export default function AsemicApp({ source }: { source: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const init = async () => {
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current

        // Check if WebGPU is supported
        if (!navigator.gpu) {
          throw new Error('WebGPU not supported on this browser.')
        }

        // Request an adapter (physical device)
        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) {
          throw new Error('No appropriate GPUAdapter found.')
        }

        // Request a device (logical device)
        const device = await adapter.requestDevice()

        // Configure the canvas context
        const context = canvas.getContext('webgpu')
        if (!context) {
          throw new Error('Unable to get WebGPU context from canvas.')
        }

        // Configure how the canvas will use the WebGPU device
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
        context.configure({
          device,
          format: presentationFormat,
          alphaMode: 'premultiplied',
        })
        const renderer = new WebGPURenderer({
          canvas,
          context,
          powerPreference: 'high-performance',
          colorBufferType: HalfFloatType,
        })
        const scene = new Scene()
        const camera = new OrthographicCamera(0, 1, 1, 0, 0, 1)

        renderer.init().then(() => {
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera)
          })
        })

        const curves = eval(source)
        const vectors = curves.map((x) => new Vector2(x[0], x[1]))
        new SimpleBrush(scene, renderer).render(vectors)

        // Add resize observer to handle canvas resizing
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const canvas = entry.target as HTMLCanvasElement
            const width = entry.contentBoxSize[0].inlineSize
            const height = entry.contentBoxSize[0].blockSize

            canvas.width = Math.max(
              1,
              Math.min(width, device.limits.maxTextureDimension2D),
            )
            canvas.height = Math.max(
              1,
              Math.min(height, device.limits.maxTextureDimension2D),
            )

            // Re-render when size changes
            // renderScene();
          }
        })

        resizeObserver.observe(canvas)

        // Clean up function
        return () => {
          resizeObserver.disconnect()
          device.destroy()
        }
      } catch (error) {
        console.error('WebGPU initialization error:', error)
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div
      className='asemic'
      style={{
        maxHeight: '80vh',
        aspectRatio: '1 / 1',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
