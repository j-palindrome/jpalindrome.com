'use client'
import { Asemic, Brush, LineBrush, SceneBuilder } from '@asemic'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { hash, time, vec2 } from 'three/tsl'

export default function Genuary18() {
  return (
    <Asemic
      postProcessing={(input) => {
        return input.add(bloom(input, 0.01))
      }}
    >
      <Brush
        type='line'
        maxLength={2}
        spacing={1}
        curvePosition={(input, { progress, builder: { h: height } }) =>
          vec2(
            hash(input.x.mul(2).add(time.mul(10))),
            hash(input.y.mul(2).add(time.mul(10))).mul(height),
          )
        }
      >
        {(g) => {
          g.repeatGrid([10, 10], ({ p, i }) => {
            g.repeat(10, () => {
              g.newCurve()
              g.repeat(4, () =>
                g.newPoints([
                  0,
                  0,
                  {
                    thickness: 100,
                    alpha: 0.1,
                    translate: [i[0] + Math.random(), i[1] + Math.random()],
                    reset: true,
                  },
                ]),
              )
            })
          })
        }}
      </Brush>
    </Asemic>
  )
}
