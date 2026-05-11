import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 md:px-6 border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row">
        <div className="flex gap-4">
          <Link href="/faq" className="hover:text-foreground">
            FAQ
          </Link>
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <p>Disclaimer: AI analysis is for informational purposes only.</p>
          <Link
            href="https://github.com/ayush4151y"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>Created by Ayush with ❤️ · @ayush4151y</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
