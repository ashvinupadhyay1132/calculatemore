
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
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  currentAge: z.coerce.number().int().positive("Current age must be a positive number."),
  retirementAge: z.coerce.number().int().positive("Retirement age must be a positive number."),
  currentSavings: z.coerce.number().min(0, "Current savings cannot be negative."),
  monthlyContribution: z.coerce.number().min(0, "Monthly contribution cannot be negative."),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative."),
  inflationRate: z.coerce.number().min(0, "Inflation rate cannot be negative.").default(3),
});

type ChartData = {
  age: number;
  value: number;
  contributions: number;
  interest: number;
};

type RetirementResult = {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  finalBalanceInTodaysDollars: number;
  chartData: ChartData[];
};

function RetirementCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 25000,
      monthlyContribution: 500,
      interestRate: 7,
      inflationRate: 3,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      interestRate,
      inflationRate,
    } = values;
    
    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement <= 0) {
      form.setError("retirementAge", { message: "Retirement age must be after current age." });
      return;
    }

    const totalMonths = yearsToRetirement * 12;
    const monthlyRate = interestRate / 100 / 12;

    const chartData: ChartData[] = [];
    let balance = currentSavings;
    let totalContributions = currentSavings;
    let totalInterest = 0;
    
    chartData.push({ age: currentAge, value: balance, contributions: totalContributions, interest: 0 });

    for (let i = 1; i <= totalMonths; i++) {
        const interestThisMonth = balance * monthlyRate;
        balance += interestThisMonth;
        totalInterest += interestThisMonth;

        balance += monthlyContribution;
        totalContributions += monthlyContribution;

        if (i % 12 === 0) {
            chartData.push({
                age: currentAge + (i / 12),
                value: parseFloat(balance.toFixed(2)),
                contributions: parseFloat(totalContributions.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2)),
            });
        }
    }

    const finalBalanceInTodaysDollars = balance / Math.pow(1 + (inflationRate / 100), yearsToRetirement);

    const resultData = {
      finalBalance: balance,
      totalContributions,
      totalInterest,
      finalBalanceInTodaysDollars,
      chartData,
    };
    setResult(<ResultDisplay result={resultData} retirementAge={retirementAge} />);
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const ResultDisplay = ({ result, retirementAge }: { result: RetirementResult, retirementAge: number }) => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">Estimated Balance at Age {retirementAge}</p>
        <p className="text-4xl font-bold font-headline text-primary">
          {formatCurrency(result.finalBalance)}
        </p>
      </div>

       <div className="text-center">
        <p className="text-muted-foreground">Purchasing Power in Today's Dollars</p>
        <p className="text-2xl font-semibold">
          {formatCurrency(result.finalBalanceInTodaysDollars)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 text-center gap-4">
        <div>
          <p className="text-muted-foreground">Total Contributions</p>
          <p className="text-lg font-bold font-headline">
            {formatCurrency(result.totalContributions)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Interest Earned</p>
          <p className="text-lg font-bold font-headline">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>
      </div>
      <ChartContainer
        config={{
          value: { label: "Total Value", color: "hsl(var(--primary))" },
          contributions: { label: "Contributions", color: "hsl(var(--muted))" },
        }}
        className="h-[250px] w-full"
      >
        <AreaChart
          data={result.chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `Age ${value}`}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="contributions"
            type="natural"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--muted))"
            stackId="1"
          />
          <Area
            dataKey="interest"
            type="natural"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
            stroke="hsl(var(--primary))"
            stackId="1"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Age</FormLabel>
                  <FormControl><Input type="number" step="any" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retirementAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retirement Age</FormLabel>
                  <FormControl><Input type="number" step="any" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="currentSavings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Savings ($)</FormLabel>
              <FormControl><Input type="number" step="any" {...field} /></FormControl>
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
              <FormControl><Input type="number" step="any" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Return (%)</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inflationRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inflation Rate (%)</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}

export function RetirementCalculatorPageClient({
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
      <RetirementCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
