import Link from "next/link";
import "../tailwind.css";
export default function Layout({ children }) {
  return (
    <html>
      <head></head>
      <body className="bg-black p-8 font-mono text-white">
        <div className="flex w-full space-x-4">
          <Link href="/blog/social-games/start">start</Link>
          <Link href="/blog/social-games/feb-26">feb 26</Link>
          <Link href="/blog/social-games/aframe">aframe</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
