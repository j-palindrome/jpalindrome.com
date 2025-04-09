import { NextRequest } from 'next/server'
import ReactMarkdown from 'react-markdown'
import { headers } from 'next/headers'

export default async function Page({ params }) {
  let { fileName } = await params
  fileName = `3 ! Pieces/Socially Engaged Games/${decodeURIComponent(fileName)}`

  const webpage = await (
    await fetch(
      `https://publish.obsidian.md/jpalindrome/${fileName.replace(/ /g, '+')}`
    )
  ).text()

  const preloadPage = webpage.match(/window\.preloadPage=f\("(.*?)"\)/)![1]
  const content = await (await fetch(preloadPage)).text()

  return (
    <div className='mt-5'>
      <p>
        Fetched from{' '}
        <a
          className='font-bold'
          href={`https://publish.obsidian.md/jpalindrome/${fileName.replace(
            / /g,
            '+'
          )}`}
        >
          Obsidian Publish
        </a>
      </p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
