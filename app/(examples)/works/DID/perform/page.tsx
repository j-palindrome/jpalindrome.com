import Client from './client'

export default async function Page() {
  const apiKey = process.env.STREAM_API_KEY
  return <Client apiKey={apiKey} />
}
