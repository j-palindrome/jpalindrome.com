import ReactMarkdown from 'react-markdown'

export default async function Page({ params }) {
  let { fileName } = await params
  fileName = `3 ! Pieces/Socially Engaged Games/${decodeURIComponent(fileName)}`

  const webpage = await (
    await fetch(
      `https://publish.obsidian.md/jpalindrome/${fileName.replace(/ /g, '+')}`,
    )
  ).text()

  const uid = webpage.match(/"uid":"(.*?)"/)
  const host = webpage.match(/"host":"(.*?)"/)
  const content = await (
    await fetch(
      `https://${host![1]}/access/${uid![1]}/${encodeURIComponent(fileName)}.md`,
    )
  ).text()

  return (
    <div className='mt-5'>
      <p>
        Fetched from{' '}
        <a
          className='font-bold'
          href={`https://publish.obsidian.md/jpalindrome/${fileName.replace(/ /g, '+')}`}
        >
          Obsidian Publish
        </a>
      </p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
