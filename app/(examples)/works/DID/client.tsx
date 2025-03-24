'use client'

import {
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk'
import { useEffect } from 'react'
import { callId } from './env'

export default function Client({ apiKey }) {
  const user: User = { id: '!anon', type: 'anonymous' }
  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user,
  })

  const call = client.call('livestream', callId)

  return (
    <StreamTheme style={{ fontFamily: 'sans-serif', color: 'white' }}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <Scene />
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  )
}

const Scene = () => {
  const call = useCall()
  console.log('call:', call)

  const { useParticipants, useCallState } = useCallStateHooks()
  const participants = useParticipants()
  const callState = useCallState()
  console.log(participants, callState)
  useEffect(() => {
    call?.join()
  }, [call])

  return (
    <div className='flex flex-wrap'>
      {participants.map((participant) => (
        <ParticipantView
          key={participant.sessionId}
          participant={participant}
          ParticipantViewUI={null}
          className='w-[50vw] *:w-full'
        />
      ))}
    </div>
  )
}
