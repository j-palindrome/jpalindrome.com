'use client'
import { useAsemic } from '@asemic'
// line that may or may not intersect

import { Brush } from '@asemic'
import { toTuple } from '@/libs/asemic/src/typeGuards'

// grid-based graphic design
export default function Genuary29() {
  const { h, mouse } = useAsemic()

  return (
    <Brush
      type='line'
      params={{ grid: toTuple(10, 10 * h) }}
      renderInit
      maxLength={1}
      onInit={(b) => {
        const { params } = b
        b.clear()
        b.repeatGrid(params.grid, ({ p }) => {
          const mouseDistance = p
            .clone()
            .multiply({ x: 1, y: h })
            .sub(mouse)
            .length()
          b.repeat(10, ({ p }) => {
            b.newCurve(
              {
                reset: true,
                translate: [p / 2, p / 2],
                scale: 1 - p,
                strength: 1,
                alpha: () => b.getRandomWithin(0, 0.5),
                thickness: (progress) =>
                  b.getRange(
                    b.noise([progress[0] % 4, progress[1], b.time]),
                    [2, 20],
                  ),
              },
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            )
          })
        })
      }}
    />
  )
}
