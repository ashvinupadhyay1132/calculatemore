import { PaycheckCalculatorPageClient } from "./client";
import { allCalculators } from "@/config/calculators";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const calculator = allCalculators.find(
    (c) => c.href === "/calculators/paycheck"
  );
  if (!calculator) {
    return {
      title: "Calculator not found",
    };
  }
  return {
    title: calculator.title,
    description: calculator.description,
    keywords: calculator.keywords,
  };
}

export default function PaycheckCalculatorPage() {
  const calculator = allCalculators.find(
    (c) => c.href === "/calculators/paycheck"
  )!;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": calculator.title,
        "description": calculator.description,
        "url": `https://calculatemore.org${calculator.href}`,
        "mainEntity": { "@id": "#calculator" }
      },
      {
        "@type": "WebApplication",
        "@id": "#calculator",
        "name": calculator.title,
        "description": calculator.description,
        "applicationCategory": "Tool, FinancialApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Works in modern browsers.",
        "offers": {
          "@type": "Offer",
          "price": "0"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": calculator.faq,
      }
    ]
  };

  return (
    <PaycheckCalculatorPageClient calculator={calculator} faqSchema={schema} />
  );
}
