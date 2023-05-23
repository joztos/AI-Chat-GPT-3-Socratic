import type { FC, ReactNode } from 'react'
import Head from 'next/head.js'
import Nav, { NavProps } from './Nav'
import { ComponentType } from 'react'

// Remove deployButton from LayoutProps
export interface LayoutProps {
  path: string;
  children?: ReactNode
  title?: string
  description?: string
}

const Layout: FC<LayoutProps> = ({
  title,
  description,
  path,
  children,
}) => {
  return (
    <div className="mx-auto h-screen flex flex-col">
      <Head>
        {title && <title>{`${title} - Steamship + Vercel Examples`}</title>}
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Remove deployButton from Nav */}
      <Nav path={path} />

      <div className="px-8 bg-accents-0">{children}</div>

      <footer className="py-10 w-full mt-auto border-t flex items-center justify-center bg-accents-1 z-20">
        <span className="text-primary">Created by</span>
        <a
          href="https://www.emdischool.com/"
          aria-label="EMDISchool.com Link"
          target="_blank"
          rel="noreferrer"
          className="text-black "
        >
          <img 
            src="https://i.im.ge/2023/04/11/IBXuyY.EMDILOGO.png" 
            alt="EMDI School logo" 
            className="inline-block h-8 w-16 ml-3 text-primary"
          />
          EMDI School
        </a>. Powered
        <a
          href="https://vercel.com/templates/next.js/ai-gpt3-chatbot"
          target="_blank"
          rel="noreferrer"
          className="text-black ml-1 mr-1"
        > by gpt3
        </a> .
      </footer>
    </div>
  )
}

export default Layout

const Noop: FC<{ children?: ReactNode }> = ({ children }) => <>{children}</>

// Remove deployButton from LayoutProps again
export interface LayoutProps {
  path: string;
  children?: ReactNode;
  title?: string;
  description?: string;
}

export function getLayout<LP extends {}>(
  Component: ComponentType<any>
): ComponentType<LP> {
  return (Component as any).Layout || Noop
}
