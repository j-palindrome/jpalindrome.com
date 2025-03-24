'use server'
import Client from './client'

export default async function Page() {
  return <Client apiKey={process.env.STREAM_API_KEY} />
}
