import Link from 'next/link';

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
        <p>Disclaimer: AI analysis is for informational purposes only.</p>
      </div>
    </footer>
  );
}
