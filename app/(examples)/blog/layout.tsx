import Link from 'next/link'
import '../tailwind.css'
export default function Layout({ children }) {
  return (
    <html>
      <head></head>
      <body className='bg-black p-8 font-mono text-white'>
        <div className='flex w-full space-x-4'>
          <Link href='/blog/social-games/feb-14'>feb 14</Link>
          <Link href='/blog/social-games/feb-26'>feb 26</Link>
          <Link href='/blog/social-games/mar-4'>mar 4</Link>
          <Link href='/blog/social-games/mar-4'>mar 4</Link>
          <Link href='/blog/social-games/Blog 3-12'>mar 12</Link>
          <Link href='/blog/social-games/Project Proposal'>
            project proposal
          </Link>
        </div>
        {children}
      </body>
    </html>
  )
}
