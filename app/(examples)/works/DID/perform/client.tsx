'use client'
import {
  Call,
  ParticipantView,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk'
import { useEffect, useMemo, useState } from 'react'
import { callId } from '../env'
import { getToken } from './token'

export default function Page({ apiKey }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const setup = async () => {
      const userId = window.prompt('Enter name:')!
      const token = await getToken(userId)
      setUserId(userId)
      setToken(token)
    }
    if (!userId) setup()
  }, [userId])
  const { client, call } = useMemo(() => {
    if (!userId || !token) return {}
    const user: User = { id: userId!.toLowerCase(), name: userId }
    const client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user,
      token,
    })
    const call = client.call('livestream', callId)
    call.join({ create: true })
    return { client, call }
  }, [userId])

  // const client = StreamVideoClient.getOrCreateInstance({
  //   apiKey: process.env.STREAM_API_KEY,
  //   user: {id: 'jay' },
  //   token,
  // })

  // const callId =
  // const call = client.call("livestream", callId);
  // const response = await call.getOrCreate({
  //   data: {
  //     // You can add multiple hosts if you want to
  //     members: [
  //       { user_id: 'jay', role: 'host' },
  //       { user_id: 'brynn', role: 'host' },
  //       { user_id: 'ari', role: 'host' },
  //       { user_id: 'alexander', role: 'host' },
  //     ],
  //   },
  // })
  // const resp = await call.get();
  // const rtmpURL = resp.call.ingress.rtmp.address;
  // const streamKey = token;

  return (
    client &&
    call && (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <LivestreamView call={call} />
        </StreamCall>
      </StreamVideo>
    )
  )
}

const LivestreamView = ({ call }: { call: Call }) => {
  const {
    useCameraState,
    useMicrophoneState,
    useParticipantCount,
    useIsCallLive,
    useParticipants,
  } = useCallStateHooks()

  const { camera: cam, isEnabled: isCamEnabled } = useCameraState()
  const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState()

  const participantCount = useParticipantCount()
  const isLive = useIsCallLive()

  const participants = useParticipants()
  console.log(participants)

  const { devices, selectedDevice } = useCameraState()

  return (
    <>
      <div className='flex flex-wrap gap-2 p-2 *:w-fit *:rounded-lg *:border *:border-black *:px-2 *:py-1'>
        <div>{isLive ? `Live: ${participantCount}` : `In Backstage`}</div>
        <button onClick={() => (isLive ? call.stopLive() : call.goLive())}>
          {isLive ? 'Stop Live' : 'Go Live'}
        </button>
        <button onClick={() => cam.toggle()}>
          {isCamEnabled ? 'Disable camera' : 'Enable camera'}
        </button>
        <select
          value={selectedDevice}
          onChange={(e) => {
            const deviceId = e.target.value
            if (deviceId === 'default') {
              cam.select(undefined)
            } else {
              cam.select(deviceId)
            }
          }}
          style={{ padding: '5px', marginRight: '4px' }}
        >
          {devices?.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <button onClick={() => mic.toggle()}>
          {isMicEnabled ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        <button onClick={() => call.leave()}>Leave call</button>
        <button onClick={() => call.endCall()}>Stop call</button>
      </div>
      <div className='flex w-full flex-wrap'>
        {participants.map((participant) => (
          <ParticipantView
            key={participant.sessionId}
            participant={participant}
            ParticipantViewUI={null}
            className='w-[50vw] *:w-full'
          />
        ))}
      </div>
    </>
  )
}
