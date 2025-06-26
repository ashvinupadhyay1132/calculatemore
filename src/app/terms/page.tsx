import Link from "next/link";
import { Icons } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold">
              CalculateMore
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12 md:py-24">
            <div className="mx-auto max-w-3xl">
                 <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Terms of Use
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                    Last updated: July 15, 2024
                </p>

                <div className="prose dark:prose-invert mt-8 max-w-none">
                    <p>By accessing and using CalculateMore, you agree to be bound by these Terms of Use.</p>

                    <h2>Disclaimer</h2>
                    <p>The calculators and information provided on this website are for informational purposes only and should not be considered financial, health, or legal advice. While we strive for accuracy, we cannot guarantee it. You should consult with a qualified professional before making any decisions based on the information provided on this site.</p>

                    <h2>Limitation of Liability</h2>
                    <p>In no event shall CalculateMore, nor its owners, be liable for any damages arising out of the use or inability to use the materials on this website.</p>
                    
                    <h2>Intellectual Property</h2>
                    <p>The content, organization, graphics, design, and other matters related to the site are protected under applicable copyrights and other proprietary laws. You may not copy, redistribute, use or publish any such matters or any part of the site.</p>

                    <h2>Governing Law</h2>
                    <p>These terms shall be governed by and defined following the laws of The United States of America.</p>
                </div>
            </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
