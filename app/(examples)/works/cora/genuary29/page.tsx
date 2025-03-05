'use client'
import { Asemic, useAsemic } from '@asemic'
// line that may or may not intersect

import MeshBrush from '@/libs/asemic/src/components/LineBrush'
import { toTuple } from '@/libs/asemic/src/typeGuards'

// grid-based graphic design
export default function Genuary29() {
  const { h, mouse } = useAsemic()
  const params = { grid: toTuple(10, 10 * h) }
  return (
    <MeshBrush renderInit maxLength={1}>
      {(b) => {
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
    </MeshBrush>
  )
}
