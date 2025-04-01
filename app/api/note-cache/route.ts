import { NextResponse } from 'next/server'

let cache
  // export const dynamic = 'force-static'
;(async () => {
  const pageTime = await (
    await fetch(`https://publish.obsidian.md/jpalindrome`, {
      next: { revalidate: 3600 },
    })
  ).text()

  const preloadCache = pageTime.match(/window.preloadCache=f\("(.*?)"\)/)![1]
  cache = await (await fetch(preloadCache)).json()
})()

export async function GET(request: Request) {
  return new NextResponse(cache, { status: 200 })
}
