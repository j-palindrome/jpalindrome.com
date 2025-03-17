import { Asemic, AsemicCanvas } from '@asemic'
export default function AsemicApp({ source }: { source: string }) {
  return (
    <div
      className='asemic'
      style={{
        maxHeight: '80vh',
        aspectRatio: '1 / 1',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <AsemicCanvas className='h-full w-full'>
        <Asemic onInit={eval(source)} />
      </AsemicCanvas>
    </div>
  )
}
