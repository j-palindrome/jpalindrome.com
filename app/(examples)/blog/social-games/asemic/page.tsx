'use client'
import {
  Asemic,
  AsemicCanvas,
  DashBrush,
  LineBrush,
  StripeBrush,
} from '@asemic'

export default function Page() {
  return (
    <AsemicCanvas className='!h-screen !w-screen'>
      <Asemic>
        {({ h }) => (
          <StripeBrush renderInit>
            {(g) =>
              g
                .newCurve(
                  { scale: [1, h], thickness: 100 },
                  { translate: [0.2, 0.2], scale: 0.8 },
                  [0, 0],
                  [0.5, 0.5],
                  [1, 1],
                )
                .newCurve([1, 0], [0, 0])
            }
          </StripeBrush>
        )}
      </Asemic>
    </AsemicCanvas>
  )
}
