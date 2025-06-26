import Link from "next/link";
import { Icons } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

export default function PrivacyPage() {
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
                    Privacy Policy
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                    Last updated: July 15, 2024
                </p>

                <div className="prose dark:prose-invert mt-8 max-w-none">
                    <p>Welcome to CalculateMore. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>

                    <h2>Information We Collect</h2>
                    <p>We do not collect any personal information that you do not voluntarily provide. All calculations are performed on your device, and the data you enter is not stored on our servers.</p>

                    <h2>Analytics</h2>
                    <p>We use Vercel Analytics, a privacy-friendly analytics service, to help us understand our website traffic and improve our services. This service does not use cookies and does not track individual users or collect personal data.</p>
                    
                    <h2>Cookies</h2>
                    <p>We do not use cookies for tracking purposes.</p>

                    <h2>Third-Party Links</h2>
                    <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of other sites. We encourage you to read their privacy policies.</p>

                    <h2>Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                </div>
            </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
