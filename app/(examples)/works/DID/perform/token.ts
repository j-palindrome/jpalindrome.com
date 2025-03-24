'use server'
import { StreamClient } from '@stream-io/node-sdk'
import { NextResponse } from 'next/server'

export async function getToken(name: string) {
  const streamClient = new StreamClient(
    process.env.STREAM_API_KEY,
    process.env.STREAM_SECRET,
  )
  await streamClient.upsertUsers([
    {
      id: name,
      role: 'admin',
    },
  ])
  const viewToken = streamClient.generateUserToken({
    user_id: name,
  })
  return viewToken
}
