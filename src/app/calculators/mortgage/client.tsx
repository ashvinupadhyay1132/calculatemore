
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
  homePrice: z.coerce.number().positive("Home price must be a positive number."),
  downPayment: z.coerce
    .number()
    .min(0, "Down payment must be a non-negative number."),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative."),
  loanTerm: z.coerce
    .number()
    .int()
    .positive("Loan term must be a positive number of years."),
  propertyTax: z.coerce
    .number()
    .min(0, "Property tax must be a non-negative number.")
    .default(0),
  homeInsurance: z.coerce
    .number()
    .min(0, "Home insurance must be a non-negative number.")
    .default(0),
}).superRefine((data, ctx) => {
  if (data.downPayment >= data.homePrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["downPayment"],
      message: "Down payment must be less than the home price.",
    });
  }
});

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

type AmortizationData = {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

type LoanResult = {
  monthlyPayment: number;
  principalAndInterest: number;
  totalInterest: number;
  totalPayment: number;
  loanAmount: number;
  chartData: ChartData[];
  amortizationSchedule: AmortizationData[];
};

const chartConfig = {
  principalAndInterest: { label: "P&I", color: "hsl(var(--primary))" },
  taxes: { label: "Taxes", color: "hsl(var(--accent))" },
  insurance: { label: "Insurance", color: "hsl(var(--destructive))" },
};

function MortgageCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homePrice: 350000,
      downPayment: 70000,
      interestRate: 6.5,
      loanTerm: 30,
      propertyTax: 4200,
      homeInsurance: 1500,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const principal = values.homePrice - values.downPayment;
    if (principal <= 0) {
      setResult(null); // Or show a message that no loan is needed
      return;
    }
    const monthlyInterestRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm * 12;

    const principalAndInterest =
      monthlyInterestRate > 0
        ? (principal *
            (monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
        : principal / numberOfPayments;

    const monthlyTax = (values.propertyTax || 0) / 12;
    const monthlyInsurance = (values.homeInsurance || 0) / 12;
    const monthlyPayment =
      principalAndInterest + monthlyTax + monthlyInsurance;

    const totalPaymentOverLoan = principalAndInterest * numberOfPayments;
    const totalInterest = totalPaymentOverLoan - principal;

    const chartData: ChartData[] = [
      {
        name: "principalAndInterest",
        value: principalAndInterest,
        fill: "var(--color-principalAndInterest)",
      },
      { name: "taxes", value: monthlyTax, fill: "var(--color-taxes)" },
      {
        name: "insurance",
        value: monthlyInsurance,
        fill: "var(--color-insurance)",
      },
    ];

    const amortizationSchedule: AmortizationData[] = [];
    let remainingBalance = principal;
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = principalAndInterest - interestPayment;
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
      principalAndInterest,
      totalInterest,
      totalPayment: totalPaymentOverLoan,
      loanAmount: principal,
      chartData,
      amortizationSchedule,
    };
    setResult(<ResultDisplay result={resultData} formValues={values} />);
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

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
                    {formatCurrency(row.principal)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.interest)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.remainingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  const ResultDisplay = ({
    result,
    formValues,
  }: {
    result: LoanResult;
    formValues: z.infer<typeof formSchema>;
  }) => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">
          Estimated Monthly Payment (PITI)
        </p>
        <p className="text-4xl font-bold font-headline">
          {formatCurrency(result.monthlyPayment)}
        </p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[160px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <div>
                    {chartConfig[name as keyof typeof chartConfig].label}:{" "}
                    {formatCurrency(value as number)}
                  </div>
                )}
              />
            }
          />
          <Pie
            data={result.chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            strokeWidth={2}
          >
            {result.chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-2 text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--color-principalAndInterest)" }}
            />
            Principal & Interest
          </p>{" "}
          <p className="font-semibold">
            {formatCurrency(result.principalAndInterest)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-2 text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--color-taxes)" }}
            />
            Property Taxes
          </p>{" "}
          <p className="font-semibold">
            {formatCurrency((formValues.propertyTax || 0) / 12)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-2 text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--color-insurance)" }}
            />
            Home Insurance
          </p>{" "}
          <p className="font-semibold">
            {formatCurrency((formValues.homeInsurance || 0) / 12)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center !mt-6">
        <div className="space-y-1 rounded-lg p-2 bg-muted/80">
          <p className="text-muted-foreground">Loan Amount</p>
          <p className="font-semibold text-lg">
            {formatCurrency(result.loanAmount)}
          </p>
        </div>
        <div className="space-y-1 rounded-lg p-2 bg-muted/80">
          <p className="text-muted-foreground">Total Interest</p>
          <p className="font-semibold text-lg">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>
      </div>
      <AmortizationTable schedule={result.amortizationSchedule} />
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="homePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="downPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Down Payment ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormLabel>Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="propertyTax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Tax ($/yr)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="homeInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Insurance ($/yr)</FormLabel>
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

export function MortgageCalculatorPageClient({
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
      <MortgageCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
