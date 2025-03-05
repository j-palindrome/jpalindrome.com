'use client'
import { AsemicCanvas, Asemic } from '@/libs/asemic/src/Asemic'
import LineBrush from '@/libs/asemic/src/components/LineBrush'

export default function Page() {
  return (
    <AsemicCanvas className='h-screen w-screen'>
      <Asemic>
        <LineBrush renderInit>{(g) => g.newCurve([0, 0], [1, 1])}</LineBrush>
      </Asemic>
    </AsemicCanvas>
  )
}
