'use client'

import { useAsemic } from '@/libs/asemic/src/Asemic'
import LineBrush from '@/libs/asemic/src/components/LineBrush'
import { noiseWaveRandom } from '@/libs/util/three/noise'
import { useThree } from '@react-three/fiber'
import { mix, PI, vec4 } from 'three/tsl'

export default function Genuary18() {
  const { h } = useAsemic({
    controls: {
      constants: {},
      refs: {},
      uniforms: {},
    },
    postProcessing: (input, { readback }) => {
      return input
    },
  })
  const size = useThree((state) => state.size)

  return (
    <Brush
      type='line'
      onInit={(g) => {
        g.newCurve([0, 0.5 * h, { thickness: size.height }], [1, 0.5 * h])
      }}
      pointColor={(input, { uv }) => {
        const f1 = noiseWaveRandom(0.23423, 0.15).pow(1.5)
        const f2 = noiseWaveRandom(0.2534, 0.15).pow(1.5)
        const f3 = noiseWaveRandom(0.924302, 0.15).pow(1.5)
        const f4 = noiseWaveRandom(0.10493872, 0.15).pow(1.5)
        return vec4(
          1,
          1,
          1,
          mix(mix(f1, f2, uv.x), mix(f3, f4, uv.x), uv.y).mul((1 / 256) * 20),
        )
      }}
      pointRotate={() => PI}
      spacing={2}
      spacingType={'count'}
    />
  )
}
