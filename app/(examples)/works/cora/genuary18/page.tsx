'use client'
import { Asemic, ParticlesBrush, GroupBuilder, Brush } from '@asemic'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'

export default function Genuary18() {
  return (
    <Asemic
      postProcessing={(input) => {
        return input.add(bloom(input, 0.2))
      }}
    >
      {(b) => (
        <Brush
          type='particles'
          renderInit={() => Math.random() * 1000}
          spacing={0.1}
          speedDamping={0.01}
          speedMax={1}
        >
          {(g) => {
            g.repeat(10, () => {
              g.newCurve({ thickness: 50 })
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
