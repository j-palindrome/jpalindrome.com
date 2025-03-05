import { AsemicCanvas, Asemic } from '@/libs/asemic/src/Asemic'
import LineBrush from '@/libs/asemic/src/components/LineBrush'

export default function Page() {
  return (
    <AsemicCanvas>
      <Asemic>
        <LineBrush>{(g) => g.newCurve([0, 0], [1, 1])}</LineBrush>
      </Asemic>
    </AsemicCanvas>
  )
}
