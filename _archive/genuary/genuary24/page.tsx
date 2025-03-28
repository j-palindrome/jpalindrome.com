'use client'

import { Asemic } from '@asemic'
import { Brush } from '@asemic'

// Inspired by brutalism
export default function Genuary23() {
  return (
    <Asemic>
      {(s) => (
        <Brush
          type='line'
          onInit={(b) => {
            b.repeat(10, () =>
              b.newShape(6, {
                reset: true,
                translate: [Math.random(), Math.random() * s.h],
                scale: 0.5,
                thickness: 10,
              }),
            )
          }}
          onUpdate={(b) => {
            b.curves.flat().forEach((p) => (p.thickness = Math.random() * 100))
          }}
          renderInit={500}
          renderUpdate='cpu'
        />
      )}
    </Asemic>
  )
}
