import Link from "next/link";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export function SiteFooter() {
    return (
        <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
           <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-md font-bold">
              CalculateMore
            </span>
          </Link>
           <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
             <Button variant="link" asChild><Link href="/about">About Us</Link></Button>
             <Button variant="link" asChild><Link href="/privacy">Privacy Policy</Link></Button>
             <Button variant="link" asChild><Link href="/terms">Terms of Use</Link></Button>
           </div>
        </div>
      </footer>
    )
}
