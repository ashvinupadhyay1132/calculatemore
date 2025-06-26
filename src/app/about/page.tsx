import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
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
                    About CalculateMore
                </h1>
                <div className="prose dark:prose-invert mt-8 max-w-none">
                    <p className="text-lg text-muted-foreground">
                        Our mission is to provide free, accurate, and easy-to-use online calculators to help people make informed decisions in their financial, health, and academic lives.
                    </p>
                    <h2 className="font-headline text-3xl font-bold">Our Story</h2>
                    <p>
                        CalculateMore started with a simple idea: what if everyone had access to powerful calculation tools without any cost? In a world full of complex decisions, we wanted to provide clarity. From a student trying to figure out their final grade, to a first-time homebuyer estimating their mortgage, to someone starting their fitness journey, we're here to help.
                    </p>
                    <h2 className="font-headline text-3xl font-bold">Our Commitment to Accuracy</h2>
                    <p>
                        We understand that you rely on our calculators for important decisions. That's why we are committed to ensuring the highest level of accuracy. Our tools are built on standard, industry-accepted formulas and are rigorously tested. We believe in transparency and strive to explain the calculations and methodologies behind each tool.
                    </p>
                    <h2 className="font-headline text-3xl font-bold">Contact Us</h2>
                    <p>
                        Have a question, suggestion, or feedback? We'd love to hear from you. Please feel free to reach out to us at contact@calculatemore.org.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
