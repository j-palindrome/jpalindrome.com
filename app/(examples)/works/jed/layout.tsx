import '../../tailwind.css'
export default function Layout({ children }) {
  return (
    <html>
      <head></head>
      <body className='m-0 h-screen w-screen bg-black'>{children}</body>
    </html>
  )
}
