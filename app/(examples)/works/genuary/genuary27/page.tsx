'use client'
// line that may or may not intersect

import { afterImage } from '@/libs/util/three/afterImage'
import { Asemic, Brush } from '@asemic'
import { float, mod, select, vec4 } from 'three/tsl'

// Inspired by brutalism
export default function Genuary26() {
  return (
    <Asemic postProcessing={(i) => afterImage(i, 0.9)}>
      {(s) => (
        <Brush
          type='dash'
          curvePosition={(input, { progress, lastFrame }) => {
            return vec4(
              lastFrame.x,
              mod(
                lastFrame.y.add(
                  select(
                    progress.mul(1000).toInt().modInt(3).greaterThan(0),
                    float(0.05).mul(progress.fract()),
                    float(-0.05).mul(progress.fract().oneMinus()),
                  ),
                ),
                s.h,
              ),
              lastFrame.zw,
            )
          }}
          maxLength={5}
          spacing={0.5}
        >
          {(b) => {
            b.newCurve([0, 0, { translate: [0, 0.5 * s.h] }])
            b.repeat(10, ({ p }) => b.newPoints([p, 0]))
          }}
        </Brush>
      )}
    </Asemic>
  )
}
