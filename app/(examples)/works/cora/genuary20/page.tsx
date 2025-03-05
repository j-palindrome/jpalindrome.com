'use client'
import { afterImage } from '@/libs/util/three/afterImage'
import { Asemic, ParticlesBrush } from '@asemic'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { vec2 } from 'three/tsl'

export default function Genuary18() {
  return (
    <Asemic
      postProcessing={(input) => {
        return afterImage(input.add(bloom(input, 0.1)), 0.7)
      }}
    >
      {(b) => (
        <ParticlesBrush
          {...{
            spacing: 20,
            recalculate: () => Math.random() * 500,
            initialSpread: true,
            pointSize: 3,
            gravityForce: 0.5,
            speedDamping: 0,
            // maxSpeed: 2,
            spinningForce: 0,
            pointPosition: (position) => {
              return vec2(position.x, position.y.div(0.03).round().mul(0.03))
            },
          }}
        >
          {(g) => {
            g.repeatGrid([2, 10], ({ i }) => {
              // if (i[0] % 2)
              if (i[0]) {
                g.transform({
                  reset: true,
                  rotate: 0.25,
                  translate: [1, 0],
                  scale: [b.h, 1],
                })
              } else {
                g.transform({ reset: true, scale: [1, b.h] })
              }
              g.newCurve(
                [
                  0,
                  0,
                  {
                    thickness: 1,
                    translate: [0, Math.random()],
                    // scale: [Math.random(), 1]
                    // reset: true
                  },
                ],
                [1, 0],
              )
            })
          }}
        </ParticlesBrush>
      )}
    </Asemic>
  )
}
