'use client'
import { useState } from 'react'

export default function Client({uris}: {uris: string[]}) {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [value, setValue] = useState(100)
  const [video, setVideo] = useState(1)

  return (
    <div className='h-screen w-screen relative flex flex-col'>
      <div className='w-full py-2 bg-black/50 backdrop-blur text-white font-mono z-10 flex space-x-2'>
        <div className='*:space-x-2 *:flex *:items-center'>
          <div>
            <input
              type='range'
              value={hue}
              onChange={(ev) => setHue(Number(ev.target.value))}
              min={-180}
              max={180}
              step={0.5}
              className='w-[200px] h-[20px]'
            ></input>
            <label>hue</label>
          </div>
          <div>
            <input
              type='range'
              value={saturation}
              onChange={(ev) => setSaturation(Number(ev.target.value))}
              min={0}
              max={200}
              step={0.5}
              className='w-[200px] h-[20px]'
            ></input>
            <label>saturation</label>
          </div>
          <div>
            <input
              type='range'
              value={value}
              onChange={(ev) => setValue(Number(ev.target.value))}
              min={0}
              max={200}
              step={0.5}
              className='w-[200px] h-[20px]'
            ></input>
            <label>value</label>
          </div>
        </div>
        <div className='flex space-x-1 h-fit *:px-2'>
          <button
            className='rounded-lg border border-white p-1'
            onClick={(ev) => {
              const str = `video: ${video} hue: ${hue} saturation: ${saturation} value: ${value}`
              window.navigator.clipboard.writeText(str)
              alert(
                `Copied values to clipboard: ${str}\nPaste to share with me!`
              )
            }}
          >
            share
          </button>
          <button
            className='rounded-lg border border-white p-1'
            onClick={(ev) => {
              let newVid = video - 1
              if (newVid > 8) newVid = 1
              if (newVid < 1) newVid = 8
              setVideo(newVid)
            }}
          >{`<`}</button>
          <button
            className='rounded-lg border border-white p-1'
            onClick={(ev) => {
              let newVid = video + 1
              if (newVid > 8) newVid = 1
              if (newVid < 1) newVid = 8
              setVideo(newVid)
            }}
          >{`>`}</button>
        </div>
      </div>
      <video
        className='h-0 grow'
        autoPlay
        muted
        loop
        src={`/assets/cora/${video}.webm`}
        style={{
          filter: `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${value}%)`,
        }}
      ></video>
    </div>
  )
}
