'use client'
import { AsemicCanvas } from '@asemic'

export default function Scene({ children }) {
  return (
    <AsemicCanvas
      dimensions={[1080, 1920]}
      useAudio={false}
      // highBitDepth={false}
      // className='cursor-none'
    >
      {children}
    </AsemicCanvas>
  )
}
