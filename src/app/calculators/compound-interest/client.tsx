
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  principal: z.coerce.number().positive("Principal must be a positive number."),
  interestRate: z.coerce
    .number()
    .min(0, "Interest rate cannot be negative."),
  years: z.coerce.number().int().positive("Years must be a positive integer."),
  contribution: z.coerce
    .number()
    .min(0, "Contribution cannot be negative.")
    .default(0),
  contributionFrequency: z.enum(["monthly", "annually"]).default("monthly"),
});

type ChartData = {
  year: number;
  value: number;
  interest: number;
  principal: number;
};

type InterestResult = {
  totalValue: number;
  totalInterest: number;
  totalPrincipal: number;
  chartData: ChartData[];
};

function CompoundInterestCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 10000,
      interestRate: 7,
      years: 10,
      contribution: 100,
      contributionFrequency: "monthly",
    },
  });

  const contributionFrequency = form.watch("contributionFrequency");

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      principal,
      interestRate,
      years,
      contribution,
      contributionFrequency,
    } = values;

    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;

    let balance = principal;
    let totalPrincipal = principal;
    let totalInterest = 0;

    const chartData: ChartData[] = [];
    chartData.push({ year: 0, value: balance, interest: 0, principal: totalPrincipal });

    for (let i = 1; i <= totalMonths; i++) {
        // Calculate interest on the current balance
        const interestThisMonth = balance * monthlyRate;
        balance += interestThisMonth;
        totalInterest += interestThisMonth;

        // Add contributions at the end of the period
        if (contributionFrequency === 'monthly') {
            balance += contribution;
            totalPrincipal += contribution;
        } else if (contributionFrequency === 'annually' && i % 12 === 0) {
            balance += contribution;
            totalPrincipal += contribution;
        }

        // Record data at the end of each year
        if (i % 12 === 0) {
            chartData.push({
                year: i / 12,
                value: parseFloat(balance.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2)),
                principal: parseFloat(totalPrincipal.toFixed(2))
            });
        }
    }


    const resultData = {
      totalValue: balance,
      totalInterest: totalInterest,
      totalPrincipal: totalPrincipal,
      chartData: chartData,
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: InterestResult }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-4">
        <div>
          <p className="text-muted-foreground">Total Principal</p>
          <p className="text-xl font-bold font-headline">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(result.totalPrincipal)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Interest</p>
          <p className="text-xl font-bold font-headline">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(result.totalInterest)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Future Value</p>
          <p className="text-2xl font-bold font-headline text-primary">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(result.totalValue)}
          </p>
        </div>
      </div>
      <ChartContainer
        config={{
          value: { label: "Total Value", color: "hsl(var(--primary))" },
          principal: { label: "Principal", color: "hsl(var(--muted))" },
          interest: { label: "Interest", color: "hsl(var(--primary))" }
        }}
        className="h-[250px] w-full"
      >
        <AreaChart
          data={result.chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `Year ${value}`}
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
            dataKey="principal"
            type="natural"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--muted))"
            stackId="1"
            name="Principal"
          />
          <Area
            dataKey="interest"
            type="natural"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
            stroke="hsl(var(--primary))"
            stackId="1"
            name="Interest"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="principal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Principal Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Additional{" "}
                  {contributionFrequency === "monthly" ? "Monthly" : "Annual"}{" "}
                  Contribution ($)
                </FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contributionFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contribution Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Number of Years</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
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

export function CompoundInterestPageClient({
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
      <CompoundInterestCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
