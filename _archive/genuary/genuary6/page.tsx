'use client'
import { easeInOutSine } from '@/libs/util/three/easing'
import { Asemic, AsemicCanvas, Brush, PointBuilder } from '@asemic'
import { random, range } from 'lodash'
import { mix, time } from 'three/tsl'

export default function Genuary6() {
  const poem = ['sometrees', 'amazing']
  return (
    <AsemicCanvas dimensions={[1080, 1920]}>
      <Asemic>
        <>
          {poem.map((_, j) =>
            range(poem[j].length).map((i) => (
              <Brush
                key={i}
                type='line'
                renderStart={j * 250}
                renderInit={2000}
                curvePosition={(input, info) => {
                  return mix(
                    info.lastFrame,
                    input,
                    easeInOutSine(
                      time
                        .sub(info.builder.settings.start / 1000)
                        .mod(2)
                        .div(2),
                    ),
                  )
                }}
                curveColor={(input, info) => {
                  return mix(
                    info.lastFrame,
                    input,
                    time
                      .sub(info.builder.settings.start / 1000)
                      .mod(2)
                      .div(2),
                  )
                }}
              >
                {(g) => {
                  g.repeat(1, () => {
                    // const point = g.getRandomWithin([0.5, 0, { reset: true }], [0.2, 0])
                    // const resetTransform: PreTransformData =
                    //   i === 0 ? { reset: true, translate: [0, 0] } : { reset: true }

                    // const point = g.toPoint([0.5, 0, resetTransform])

                    g.newCurve([
                      0,
                      0,
                      {
                        strength: 0,
                        reset: true,
                        translate: [
                          g.getRandomWithin(0.5, 0.05),
                          i === 0 ? g.h : 0,
                        ],
                        scale: (i === 0 ? -1 : 1) / 6,
                      },
                    ])
                      .repeat(8, () => {
                        g.newPoints([
                          0,
                          1,
                          {
                            thickness: Math.random() * 10,
                            alpha: Math.random() * 0.7,
                          },
                        ])
                          .transform({
                            rotate:
                              g.currentTransform.translate.x < 0.2
                                ? i === 0
                                  ? random(0, 0.2)
                                  : random(-0.2, 0)
                                : g.currentTransform.translate.x > 0.8
                                  ? i === 0
                                    ? random(-0.2, 0)
                                    : random(0, 0.2)
                                  : random(-0.08, 0.08),
                            scale: 0.9,
                          })
                          .transform({ translate: [0, 1] })
                      })
                      .newText(poem[i][j], {
                        strength: 0,
                        alpha: 1,
                        thickness: 1,
                        translate: i === 0 ? [0, 0.7] : [0, 0],
                        scale: new PointBuilder([0.07, 0.07]).divide(
                          g.currentTransform.scale,
                        ),
                      })
                  })
                }}
              </Brush>
            )),
          )}
        </>
      </Asemic>
    </AsemicCanvas>
  )
}
