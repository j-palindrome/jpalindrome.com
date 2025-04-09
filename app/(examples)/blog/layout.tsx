import Link from 'next/link'
import '../tailwind.css'
import { headers } from 'next/headers'
export default async function Layout({ children }) {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto')
  console.log(`${protocol}://${host}/api/note-cache`)

  const links: string[] = await (
    await fetch(
      `${protocol}://${host}/api/note-cache?title=${encodeURIComponent(
        '3 ! Pieces/Socially Engaged Games'
      )}`
    )
  ).json()
  return (
    <html>
      <head></head>
      <body className='bg-black p-8 font-mono text-white'>
        <div className='flex w-full *:m-2 whitespace-nowrap flex-wrap'>
          {links.sort().map((link) => {
            const filteredLink = link.split('/').pop()?.split('.').shift()
            return (
              <Link
                href={`/blog/social-games/${filteredLink}`}
                key={filteredLink}
              >
                {filteredLink}
              </Link>
            )
          })}
        </div>
        {children}
      </body>
    </html>
  )
}
