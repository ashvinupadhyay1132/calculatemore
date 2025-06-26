
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  loanAmount: z.coerce
    .number()
    .positive("Loan amount must be a positive number."),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative."),
  loanTerm: z.coerce
    .number()
    .int()
    .positive("Loan term must be a positive number of years."),
});

type ChartData = {
  name: "principal" | "interest";
  value: number;
};

type AmortizationData = {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

type LoanResult = {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  chartData: ChartData[];
  amortizationSchedule: AmortizationData[];
};

const chartConfig = {
  principal: {
    label: "Principal",
    color: "hsl(var(--primary))",
  },
  interest: {
    label: "Interest",
    color: "hsl(var(--muted))",
  },
};

function LoanCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 50000,
      interestRate: 5.5,
      loanTerm: 10,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const principal = values.loanAmount;
    const monthlyInterestRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyInterestRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment =
        (principal *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    const chartData: ChartData[] = [
      { name: "principal", value: principal },
      { name: "interest", value: totalInterest },
    ];

    const amortizationSchedule: AmortizationData[] = [];
    let remainingBalance = principal;
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      amortizationSchedule.push({
        month: i,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
      });
    }

    const resultData = {
      monthlyPayment,
      totalInterest,
      totalPayment,
      chartData,
      amortizationSchedule,
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const AmortizationTable = ({
    schedule,
  }: {
    schedule: AmortizationData[];
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          View Amortization Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Amortization Schedule</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell className="text-right">
                    {row.principal.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.interest.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.remainingBalance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  const ResultDisplay = ({ result }: { result: LoanResult }) => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">Monthly Payment</p>
        <p className="text-4xl font-bold font-headline">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(result.monthlyPayment)}
        </p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[160px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={result.chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            strokeWidth={2}
          >
            {result.chartData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={`var(--color-${entry.name})`}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="grid grid-cols-2 gap-4 text-center text-sm">
        <div className="space-y-1 rounded-lg p-2 bg-primary/10">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary"></span> Principal
          </p>
          <p className="font-semibold text-lg">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(result.totalPayment - result.totalInterest)}
          </p>
        </div>
        <div className="space-y-1 rounded-lg p-2 bg-muted/80">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>{" "}
            Interest
          </p>
          <p className="font-semibold text-lg">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(result.totalInterest)}
          </p>
        </div>
      </div>
      <div className="text-center !mt-6">
        <p className="text-muted-foreground">Total Paid Over Loan Term</p>
        <p className="text-2xl font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(result.totalPayment)}
        </p>
      </div>
      <AmortizationTable schedule={result.amortizationSchedule} />
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 50000" {...field} />
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
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5.5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="loanTerm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Term (Years)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} />
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

export function LoanCalculatorPageClient({
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
      <LoanCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
