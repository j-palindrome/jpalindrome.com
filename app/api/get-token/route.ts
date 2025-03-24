import { StreamClient } from '@stream-io/node-sdk'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  params: Promise<{ params: { name: string } }>,
) {
  const streamClient = new StreamClient(
    process.env.STREAM_API_KEY,
    process.env.STREAM_SECRET,
  )
  const gotParams = await params
  await streamClient.upsertUsers([
    {
      id: gotParams.params.name ?? '!anon',
      role: gotParams.params.name ? 'admin' : 'anonymous',
    },
  ])
  const viewToken = streamClient.generateUserToken({
    user_id: gotParams.params.name,
  })
  return new NextResponse(viewToken)
}
