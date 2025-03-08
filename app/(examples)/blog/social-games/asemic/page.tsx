'use client'
import { Asemic, AsemicCanvas, Brush } from '@asemic'

export default function Page() {
  return (
    <AsemicCanvas className='!absolute left-0 top-0 -z-10 !h-screen !w-screen'>
      <Asemic>
        <Brush type='stripe'>
          {(g) =>
            g
              .newCurve([0, 0], [0.5, 0.75 * g.h], [1, g.h])
              .newCurve([0, 0], [1, 0])
              .newCurve([0, 0], [0, 1])
              .newCurve([0, 0], [0.5, 1])
          }
        </Brush>
      </Asemic>
    </AsemicCanvas>
  )
}
