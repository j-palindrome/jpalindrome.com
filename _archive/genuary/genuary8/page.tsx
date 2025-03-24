'use client'

import { AsemicCanvas, Brush } from '@asemic'

export default function Genuary8() {
  return (
    <AsemicCanvas dimensions={[1080, 1920]}>
      <Brush type='particles'>{(g) => {}}</Brush>
    </AsemicCanvas>
  )
}
