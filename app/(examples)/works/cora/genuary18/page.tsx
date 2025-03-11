'use client'
import { Asemic, ParticlesBrush, GroupBuilder, Brush } from '@asemic'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { gaussianBlur } from '@util/three/effects'
import { pointUV, uv, vec2, vec4 } from 'three/tsl'

export default function Genuary18() {
  return (
    <Asemic
      postProcessing={(input) => {
        return bloom(input, 5)
      }}
    >
      {(b) => (
        <Brush
          type='particles'
          spacing={100}
          renderInit={() => Math.random() * 1000}
          // speedDamping={0.01}
          speedMax={0.5}
          speedFrame={0.5}
          particleCount={1e5}
          attractorPull={0}
          attractorPush={1}
          particleSize={10}
          pointColor={(input) =>
            vec4(
              // 245 / 255, 238 / 255, 174 / 255,
              176 / 255,
              148 / 255,
              69 / 255,
              0.03,
            )
          }
        >
          {(g) => {
            g.repeat(10, () => {
              g.newCurve({ thickness: 50, alpha: 0.1 })
              g.repeat(3, () =>
                g.newPoints(g.getRandomWithin([0, 0], [1, b.h])),
              )
            })
          }}
        </Brush>
      )}
    </Asemic>
  )
}
