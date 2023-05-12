import Link from '@vercel/examples-ui/link'
import { Layout, Text, Page } from '@vercel/examples-ui'

const REPO_URL = 'https://github.com/steamship-core/vercel-examples/tree/main'

export interface NavProps {
  path: string
}

export default function Nav({ path }: NavProps) {
  const repositoryUrl = `${REPO_URL}/${path}`

  return (
    <nav className="border-b border-gray-200 py-5 relative z-20 bg-background shadow-[0_0_15px_0_rgb(0,0,0,0.1)]">
      <div className="flex items-center lg:px-6 px-8 mx-auto max-w-7xl px-14">
        <div className="flex flex-row items-center">
          <Link href="https://www.samasat.com/">
            <img src="https://samasat.com/wp-content/uploads/2022/01/Disen%CC%83o-sin-ti%CC%81tulo.png" alt="Samasat logo" className="16 h-8"/>
          </Link>
          <ul className="flex items-center content-center">
            <li className="ml-2 text-gray-200">
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M16.88 3.549L7.12 20.451"></path>
              </svg>
            </li>
          </ul>
        </div>
        <div className="flex-1 justify-end hidden md:flex">
          <nav className="flex-row inline-flex items-center">
          </nav>
        </div>
      </div>
    </nav>
  )
}
