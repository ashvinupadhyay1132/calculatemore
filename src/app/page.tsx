import Link from "next/link";
import type { Metadata } from "next";
import { calculatorGroups } from "@/config/calculators";
import { CalculatorCard } from "@/components/calculator-card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "CalculateMore: Free, Accurate Online Calculators for Every Need",
  description: "From complex financial planning with our mortgage and investment calculators to simple everyday math, CalculateMore provides a comprehensive suite of powerful, user-friendly, and 100% free online calculators.",
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CalculateMore",
    "url": "https://calculatemore.org",
    "logo": "https://calculatemore.org/logo.png",
    "sameAs": [
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
        <section className="space-y-6 bg-gradient-to-r from-teal-600 to-emerald-500 py-12 text-white md:py-24 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-white/20 px-4 py-1.5 text-sm font-medium">
              Your All-in-One Calculator Suite
            </div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Precision and Clarity for Every Calculation
            </h1>
            <p className="max-w-[42rem] leading-normal text-white/90 sm:text-xl sm:leading-8">
              From complex financial planning to essential health metrics and academic success,
              CalculateMore provides a comprehensive suite of powerful, user-friendly calculators.
            </p>
            <div className="space-x-4 mt-4">
              <Button asChild size="lg" className="bg-golden-yellow-400 text-black hover:bg-golden-yellow-500">
                <Link href="/calculators">Explore Calculators</Link>
              </Button>
            </div>
          </div>
        </section>

        {calculatorGroups.map((group, index) => (
          <section
            id={group.id}
            key={group.id}
            className={`container space-y-8 py-8 md:py-12 lg:py-24 ${index % 2 === 1 ? 'bg-muted/50 dark:bg-transparent' : ''}`}
          >
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                {group.name} Calculators
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                {group.description}
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
              {group.calculators.map((calculator) => (
                <CalculatorCard key={calculator.href} calculator={calculator} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
