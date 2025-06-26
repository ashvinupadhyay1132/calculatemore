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
  initialAmount: z.coerce.number().positive("Initial amount must be positive."),
  years: z.coerce.number().int().positive("Years must be a positive number."),
  inflationRate: z.coerce
    .number()
    .min(0, "Inflation rate cannot be negative."),
});

type InflationResult = {
  futureValue: number;
  futureAmountNeeded: number;
  totalDevaluation: number;
};

function InflationCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 1000,
      years: 10,
      inflationRate: 3.5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { initialAmount, years, inflationRate } = values;
    const rateDecimal = inflationRate / 100;

    // The value of money in the future, in today's dollars
    const futureValue = initialAmount / Math.pow(1 + rateDecimal, years);

    // The amount of money needed in the future to have today's buying power
    const futureAmountNeeded =
      initialAmount * Math.pow(1 + rateDecimal, years);

    const resultData = {
      futureValue: futureValue,
      futureAmountNeeded: futureAmountNeeded,
      totalDevaluation: initialAmount - futureValue,
    };
    setResult(<ResultDisplay result={resultData} formValues={values} />);
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const ResultDisplay = ({
    result,
    formValues,
  }: {
    result: InflationResult;
    formValues: z.infer<typeof formSchema>;
  }) => (
    <div className="text-center space-y-4">
      <p className="max-w-xs mx-auto text-muted-foreground">
        In {formValues.years} years,{" "}
        {formatCurrency(formValues.initialAmount)} will have the same buying
        power as:
      </p>
      <p className="text-6xl font-bold font-headline">
        {formatCurrency(result.futureValue)}
      </p>
      <p className="text-muted-foreground">
        (a total devaluation of {formatCurrency(result.totalDevaluation)})
      </p>
      <div className="pt-4">
        <p className="text-muted-foreground">
          To have the same buying power of{" "}
          {formatCurrency(formValues.initialAmount)} today, you will need this
          amount in {formValues.years} years:
        </p>
        <p className="text-2xl font-semibold text-primary">
          {formatCurrency(result.futureAmountNeeded)}
        </p>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="initialAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="years"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Years from Today</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inflationRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Annual Inflation Rate (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 3.5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Calculate Buying Power
        </Button>
      </form>
    </Form>
  );
}

export function InflationCalculatorPageClient({
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
      <InflationCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
