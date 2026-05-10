import Link from 'next/link';
import { Logo } from '../icons/logo';
import { NavMenu } from './nav-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <NavMenu />
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-xl font-headline">
              NutriScan AI
            </span>
          </Link>
        </div>
        <div className="w-8"></div>
      </div>
    </header>
  );
}
