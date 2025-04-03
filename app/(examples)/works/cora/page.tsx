import { sanityFetch } from '@/sanity/lib/fetch'
import Client from './client'
import groq from 'groq'
import { CoraQueryResult } from '@/sanity.types'

const coraQuery = groq`*[_type == 'demo' && slug.current == 'cora']{..., files[]{..., uploadSource {..., asset-> }}}[0]`
export default async function Page() {
  const uris = await sanityFetch<CoraQueryResult>({
    query: coraQuery,
  })!
  console.log(uris)

  return (
    <>
      <Client uris={uris!.files!.map((x) => x.uploadSource!.asset!.url!)} />
    </>
  )
}
