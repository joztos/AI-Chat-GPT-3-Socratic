import Link from '@vercel/examples-ui/link';
import Button from '@vercel/examples-ui/button';
import Image from 'next/image';

export interface NavProps {
  path: string;
}

export default function Nav({ path }: NavProps) {
  const repositoryUrl = `https://samasat.com`;

  return (
    <nav className="border-b border-gray-200 py-5 relative z-20 bg-background shadow-[0_0_15px_0_rgb(0,0,0,0.1)]">
      <div className="flex items-center lg:px-6 px-8 mx-auto max-w-7xl px-14 justify-between">
        <div className="flex flex-row items-center">
          <Link href="https://www.emdischool.com/">
            <Image
              src="/EMDILOGO.png"
              alt="Logo of EMDI School"
              width={120}
              height={48}
            />
          </Link>
        </div>
        <div className="flex items-center">
          <Image
            src="/vercelLogo.png"  // path to your local Vercel logo image
            alt="Vercel Logo"
            width={32}
            height={32}
          />
        </div>
      </div>
    </nav>
  );
}
