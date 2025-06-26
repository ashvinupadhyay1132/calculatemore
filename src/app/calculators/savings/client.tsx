
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  savingsGoal: z.coerce
    .number()
    .positive("Savings goal must be a positive number."),
  initialSavings: z.coerce.number().min(0, "Cannot be negative.").default(0),
  monthlyContribution: z.coerce
    .number()
    .min(0, "Cannot be negative.")
    .default(0),
  interestRate: z.coerce.number().min(0, "Cannot be negative.").default(0),
});

type SavingsResult = {
  timeToGoal: string;
  finalBalance: number;
};

function SavingsCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      savingsGoal: 10000,
      initialSavings: 1000,
      monthlyContribution: 200,
      interestRate: 5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { savingsGoal, initialSavings, monthlyContribution, interestRate } =
      values;

    if (initialSavings >= savingsGoal) {
      setResult(<ResultDisplay result={{ timeToGoal: "You've already reached your goal!", finalBalance: initialSavings }} />);
      return;
    }
    
    if (monthlyContribution <= 0 && interestRate <= 0) {
       setResult(<ResultDisplay result={{ timeToGoal: "It's not possible to reach your goal with no contributions or interest.", finalBalance: initialSavings }} />);
       return;
    }

    let balance = initialSavings;
    let months = 0;
    const monthlyRate = interestRate / 100 / 12;

    while (balance < savingsGoal) {
      const interestThisMonth = balance * monthlyRate;
      balance += interestThisMonth;
      balance += monthlyContribution;
      months++;

      if (months > 1200) { // Safety break after 100 years
        setResult(<ResultDisplay result={{ timeToGoal: "It will take over 100 years to reach your goal.", finalBalance: balance }} />);
        return;
      }
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const yearStr = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
    const monthStr = remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : '';
    const timeToGoal = [yearStr, monthStr].filter(Boolean).join(' ');

    setResult(<ResultDisplay result={{ timeToGoal: timeToGoal || "Instantly", finalBalance: balance }} />);
  }

  const ResultDisplay = ({ result }: { result: SavingsResult }) => (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">It will take you approximately</p>
      <p className="text-5xl font-bold font-headline">{result.timeToGoal}</p>
      <p className="text-muted-foreground">
        to reach your goal.
      </p>
      <p className="text-sm">
        Your final balance will be around {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(result.finalBalance)}.
      </p>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="savingsGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savings Goal ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initialSavings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Savings ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyContribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Contribution ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Interest Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}

export function SavingsCalculatorPageClient({
  calculator,
  faqSchema,
}: {
  calculator: Calculator;
  faqSchema: object;
}) {
  const [result, setResult] = useState<React.ReactNode | null>(null);

  return (
    <CalculatorPage
      title={calculator.title}
      description={calculator.description}
      result={result}
      faqSchema={faqSchema}
    >
      <SavingsCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
