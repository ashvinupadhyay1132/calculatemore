import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Analytics } from "@vercel/analytics/react"
import { Nunito_Sans, Open_Sans } from 'next/font/google'
import { BackToTopButton } from '@/components/back-to-top-button';

const open_sans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const nunito_sans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700', '800', '900']
})


export const metadata: Metadata = {
  metadataBase: new URL('https://calculatemore.org'),
  title: {
    default: "CalculateMore: World's Most Advanced Free Online Calculators",
    template: "%s | CalculateMore",
  },
  description: 'Achieve 100% accuracy with CalculateMore, the most advanced suite of free online calculators. Get instant, precise results for mortgage, loans, BMI, GPA, compound interest, and scientific calculations. Your ultimate tool for financial, health, and academic success.',
  keywords: [
    "online calculators", "free calculators", "calculator suite", "advanced calculator",
    "financial calculator", "mortgage calculator", "loan calculator", "car loan calculator",
    "paycheck calculator", "EMI calculator", "compound interest calculator", "retirement calculator",
    "investment calculator", "inflation calculator", "currency converter",
    "health calculator", "BMI calculator", "calorie calculator", "TDEE calculator", "body fat calculator",
    "academic calculator", "grade calculator", "GPA calculator", "final grade calculator",
    "math calculator", "scientific calculator", "percentage calculator", "fraction calculator", "age calculator",
    "financial planning tools", "online math tools", "health and fitness calculators",
    "accurate calculator", "secure calculator", "PEMDAS calculator", "shunting-yard algorithm"
  ],
   openGraph: {
    title: "CalculateMore: World's Most Advanced Free Online Calculators",
    description: "The ultimate suite of free, accurate calculators for finance, health, and academic needs.",
    type: 'website',
    locale: 'en_US',
    url: 'https://calculatemore.org',
    siteName: 'CalculateMore',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a101e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CalculateMore",
    "url": "https://calculatemore.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://calculatemore.org/calculators?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };


  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={cn("font-sans antialiased", open_sans.variable, nunito_sans.variable)}>
        {children}
        <Toaster />
        <Analytics />
        <BackToTopButton />
      </body>
    </html>
  );
}
