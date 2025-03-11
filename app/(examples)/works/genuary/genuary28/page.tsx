'use client'
// line that may or may not intersect
import { Asemic, Brush } from '@asemic'
import { bezier2 } from '@/libs/util/three/curves'
import { positionLocal, vec2, vec4 } from 'three/tsl'

export default function Genuary26() {
  const words = [
    'scroll',
    'to',
    'one',
    'moment',
    'without',
    'unrecognized',
    'feature',
    'length',
    'composite',
    'organization',
    'memory',
    'unsettled',
    'lengthwise',
    'underfit',
    'overenrolled',
    'altogether',
    'forlorn',
    'mismanaged',
  ]
  const params = { index: 0, lastTime: 0 }
  return (
    <Asemic>
      {(s) =>
        words.map((word, i) => (
          <Brush
            type='line'
            key={i}
            renderInit
            pointColor={(p) => {
              return vec4(
                p.xyz,
                bezier2(
                  positionLocal.y.div(s.h),
                  vec2(0, 0),
                  vec2(0.5, 2),
                  vec2(1, 0),
                )
                  .y.pow(3)
                  .mul(p.a),
              )
            }}
          >
            {(b) => {
              if (b.time === 0) {
                b.newText(word, {
                  thickness: () => Math.random() * 8,
                  scale: 1 / 10,
                  translate: [0, -0.2 + i * -0.2],
                  alpha: Math.random(),
                })
              } else {
                b.curves.flat().forEach((p) =>
                  p.add({
                    x: 0,
                    y: 3 * b.hash(params.index) * (b.time - params.lastTime),
                  }),
                )
                if (b.curves[0][0].y > s.h) {
                  params.index++
                  b.curves.flat().forEach((p) => {
                    p.sub({ x: 0, y: s.h + 0.2 })
                    p.alpha = b.hash(params.index)
                  })
                }
                params.lastTime = b.time
              }
            }}
          </Brush>
        ))
      }
    </Asemic>
  )
}
