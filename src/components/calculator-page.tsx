import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

export interface CalculatorPageProps {
  title: string;
  description: string;
  children: ReactNode;
  result?: ReactNode;
  faqSchema?: object;
}

export function CalculatorPage({
  title,
  description,
  children,
  result,
  faqSchema,
}: CalculatorPageProps) {
  return (
    <div className="space-y-6">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/calculators">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Calculators
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tighter">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Inputs</CardTitle>
            <CardDescription>
              Enter the required values to calculate.
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Result</CardTitle>
            <CardDescription>
              The calculated result will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {result || (
              <div className="text-center text-muted-foreground">
                Enter values and click calculate to see the result.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
