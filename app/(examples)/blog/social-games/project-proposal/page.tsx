export default async function Page() {
  const fileName = '3-1 ! Pieces/Socially Engaged Games/Project Proposal'
  const content = await (
    await fetch(
      `https://publish-01.obsidian.md/access/58f6f83d01cfca4d15827a79f37aac79/${encodeURIComponent(fileName)}.md`,
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
      <div className='whitespace-pre-wrap'>{content}</div>
    </div>
  )
}
