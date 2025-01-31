'use client'
import { useEffect, useRef, useState } from 'react'
import { now } from 'lodash'
import { Color } from 'three'
import { slides } from './slides'
import GroupBuilder from '@/util/src/asemic/Builder'
import { useEventListener } from '@/util/src/dom'
import Asemic from '@/util/src/asemic/Asemic'
import PointBrush from '@/util/src/asemic/PointBrush'

export default function DigiRis() {
  const [currentChild, setCurrentChild] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  const defaultFunc = (b: GroupBuilder) =>
    // @ts-ignore
    b.set({ thickness: 2, color: new Color('pink') })

  // useEffect(() => {
  //   const hydra = hydraRef.current.synth
  //   slides[currentChild]?.(hydra.src(hydra.s0)).out()
  // }, [currentChild])

  useEventListener(
    'keydown',
    ev => {
      console.log(ev.key)

      switch (ev.key) {
        case 'ArrowLeft':
          setCurrentChild(currentChild - 1)
          break
        case 'ArrowRight':
          setCurrentChild(currentChild + 1)
          break
      }
    },
    [currentChild]
  )

  return (
    <div className='bg-black'>
      <div className='h-full w-full absolute top-0 left-0'>
        <canvas ref={canvasRef} className='h-full w-full' />
      </div>
      {/* <Asemic builder={slides[currentChild].asemic?.[0] ?? (b) => b}>
      </Asemic> */}
      <div className='text-pink-600 z-10 absolute top-0 left-0 h-full w-full font-mono font-bold'>
        {slides[currentChild]?.slide}
      </div>
    </div>
  )
}
