import { NextResponse } from 'next/server'

// let cache
// export const dynamic = 'force-static'

export async function GET(request: Request) {
  const pageTime = await (
    await fetch(`https://publish.obsidian.md/jpalindrome`, {
      next: { revalidate: 3600 },
    })
  ).text()

  const preloadCache = pageTime.match(/window.preloadCache=f\("(.*?)"\)/)![1]
  const cache = await (await fetch(preloadCache)).json()
  const titles = Object.keys(cache)
  const { searchParams } = new URL(request.url)
  const titleParam = searchParams.get('title')
  const filteredTitles = titles.filter((title) =>
    titleParam ? title.includes(titleParam) : true
  )

  return NextResponse.json(filteredTitles, { status: 200 })
}
