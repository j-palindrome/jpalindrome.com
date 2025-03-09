'use client'
import { Asemic, AsemicCanvas, Brush } from '@asemic'

export default function Page() {
  return (
    <AsemicCanvas className='!absolute left-0 top-0 -z-10 !h-screen !w-screen'>
      <Asemic>
        <Brush type='line' onDrag={(ev) => console.log('yes')}>
          {(g) => g.newCurve([0, 0, { thickness: 50 }], [1, 1])}
        </Brush>
      </Asemic>
    </AsemicCanvas>
  )
}
