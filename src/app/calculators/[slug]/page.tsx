import { allCalculators } from "@/config/calculators";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Icons, type IconName } from "@/components/icons";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getCalculatorFromParams(params: PageProps["params"]) {
  const slug = params.slug;
  const calculator = allCalculators.find((calc) => calc.href.endsWith(slug));

  if (!calculator) {
    return null;
  }

  return calculator;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const calculator = await getCalculatorFromParams(params);

  if (!calculator) {
    return {};
  }

  return {
    title: `${calculator.title} - Coming Soon`,
    description: `The ${calculator.title} is currently under development. Check back soon for our powerful, free-to-use ${calculator.title.toLowerCase()}.`,
  };
}

export default async function CalculatorComingSoonPage({ params }: PageProps) {
  const calculator = await getCalculatorFromParams(params);

  if (!calculator) {
    notFound();
  }

  const Icon = Icons[calculator.icon as IconName];

  return (
    <div className="flex flex-col items-center justify-center text-center h-[60vh] space-y-4">
      <div className="p-4 bg-primary/10 rounded-full">
        {Icon && <Icon className="h-12 w-12 text-primary" />}
      </div>
      <h1 className="font-headline text-4xl font-bold tracking-tight">
        {calculator.title}
      </h1>
      <p className="text-2xl text-muted-foreground">Coming Soon!</p>
      <p className="max-w-md">
        This calculator is currently under construction. We are working hard to
        bring it to you. Please check back later.
      </p>
      <Button asChild>
        <Link href="/calculators">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Calculators
        </Link>
      </Button>
    </div>
  );
}
