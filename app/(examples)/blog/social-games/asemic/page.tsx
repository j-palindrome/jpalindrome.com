'use client'
import { AsemicCanvas, Asemic, DotBrush } from '@asemic'
import { LineBrush } from '@asemic'

export default function Page() {
  return (
    <AsemicCanvas className='!h-screen !w-screen'>
      <Asemic>
        <DotBrush renderInit>{(g) => g.newCurve([0, 0], [1, 1])}</DotBrush>
      </Asemic>
    </AsemicCanvas>
  )
}
