'use client'
import {
  Asemic,
  AsemicCanvas,
  Brush,
  DashBrush,
  LineBrush,
  ParticlesBrush,
  StripeBrush,
} from '@asemic'

export default function Page() {
  return (
    <AsemicCanvas className='!h-screen !w-screen'>
      <Asemic>
        {({ h }) => (
          <Brush type='particles'>{(g) => g.newCurve([0, 0], [1, 1])}</Brush>
        )}
      </Asemic>
    </AsemicCanvas>
  )
}
