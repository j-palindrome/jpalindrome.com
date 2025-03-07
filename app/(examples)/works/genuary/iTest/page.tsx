'use client'
// line that may or may not intersect

import { Asemic } from '@/libs/asemic/src/Asemic'
import ParticlesBrush from '@/libs/asemic/src/components/ParticlesBrush'

// Inspired by brutalism
export default function Genuary26() {
  return (
    <Asemic>
      {(s) => (
        <Brush
          type='particles'
          // renderInit
          onInit={(b) => {
            b.clear()
            b.transform({ reset: true, thickness: 200 })
            b.newCurve([0, 0.2], [0, 1], [0.7, s.h])
          }}
          attractorPush={0.9}
          speedDamping={1e-1}
          attractorPull={0}
          spacing={100}
          spacingType='count'
        />
      )}
    </Asemic>
  )
}
