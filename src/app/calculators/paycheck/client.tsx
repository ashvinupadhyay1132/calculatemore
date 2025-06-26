
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  grossPay: z.coerce.number().positive("Gross pay must be positive."),
  payFrequency: z.enum(["annually", "monthly", "bi-weekly", "weekly"]),
  filingStatus: z.enum(["single", "married"]),
  preTaxDeductions: z.coerce.number().min(0).default(0),
  stateTaxRate: z.coerce.number().min(0).max(15).default(0),
});

type PaycheckResult = {
  grossPayPeriod: number;
  federalTaxPeriod: number;
  stateTaxPeriod: number;
  socialSecurityPeriod: number;
  medicarePeriod: number;
  deductionsPeriod: number;
  netPayPeriod: number;
  annualGross: number;
  annualNet: number;
  payPeriodsPerYear: number;
};

function PaycheckCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossPay: 50000,
      payFrequency: "annually",
      filingStatus: "single",
      preTaxDeductions: 0,
      stateTaxRate: 5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      grossPay,
      payFrequency,
      filingStatus,
      preTaxDeductions,
      stateTaxRate,
    } = values;

    // 1. Calculate Annual Gross & Pay Periods
    let annualGross = 0;
    let payPeriodsPerYear = 1;
    let grossPayPerPeriod = 0;
    switch (payFrequency) {
      case "annually":
        annualGross = grossPay;
        payPeriodsPerYear = 1;
        grossPayPerPeriod = grossPay;
        break;
      case "monthly":
        annualGross = grossPay * 12;
        payPeriodsPerYear = 12;
        grossPayPerPeriod = grossPay;
        break;
      case "bi-weekly":
        annualGross = grossPay * 26;
        payPeriodsPerYear = 26;
        grossPayPerPeriod = grossPay;
        break;
      case "weekly":
        annualGross = grossPay * 52;
        payPeriodsPerYear = 52;
        grossPayPerPeriod = grossPay;
        break;
    }

    const deductionsPerPeriod = preTaxDeductions;
    const annualDeductions = deductionsPerPeriod * payPeriodsPerYear;

    // 2. Calculate Taxable Income
    const standardDeduction = filingStatus === "single" ? 14600 : 29200; // 2024
    const federalTaxableIncome = Math.max(
      0,
      annualGross - annualDeductions - standardDeduction
    );

    // 3. Calculate Federal Income Tax (simplified 2024 brackets)
    let federalTax = 0;
    if (filingStatus === "single") {
      if (federalTaxableIncome > 609350)
        federalTax = 183647.25 + (federalTaxableIncome - 609350) * 0.37;
      else if (federalTaxableIncome > 243725)
        federalTax = 52755 + (federalTaxableIncome - 243725) * 0.35;
      else if (federalTaxableIncome > 191950)
        federalTax = 37104 + (federalTaxableIncome - 191950) * 0.32;
      else if (federalTaxableIncome > 100525)
        federalTax = 16290 + (federalTaxableIncome - 100525) * 0.24;
      else if (federalTaxableIncome > 47150)
        federalTax = 5147 + (federalTaxableIncome - 47150) * 0.22;
      else if (federalTaxableIncome > 11600)
        federalTax = 1160 + (federalTaxableIncome - 11600) * 0.12;
      else federalTax = federalTaxableIncome * 0.1;
    } else {
      // Married Filing Jointly
      if (federalTaxableIncome > 731300)
        federalTax = 186615 + (federalTaxableIncome - 731300) * 0.37;
      else if (federalTaxableIncome > 487450)
        federalTax = 105510 + (federalTaxableIncome - 487450) * 0.35;
      else if (federalTaxableIncome > 383900)
        federalTax = 74208 + (federalTaxableIncome - 383900) * 0.32;
      else if (federalTaxableIncome > 201050)
        federalTax = 32580 + (federalTaxableIncome - 201050) * 0.24;
      else if (federalTaxableIncome > 94300)
        federalTax = 10294 + (federalTaxableIncome - 94300) * 0.22;
      else if (federalTaxableIncome > 23200)
        federalTax = 2320 + (federalTaxableIncome - 23200) * 0.12;
      else federalTax = federalTaxableIncome * 0.1;
    }
    federalTax = Math.max(0, federalTax);

    // 4. Calculate FICA Taxes (2024)
    const socialSecurityTax = Math.min(annualGross, 168600) * 0.062;
    const medicareTax = annualGross * 0.0145;

    // 5. Calculate State Tax
    const stateTax = (annualGross - annualDeductions) * (stateTaxRate / 100);

    // 6. Calculate Net Pay
    const totalAnnualTaxes =
      federalTax + socialSecurityTax + medicareTax + stateTax;
    const annualNet = annualGross - totalAnnualTaxes - annualDeductions;

    const resultData = {
      grossPayPeriod: grossPayPerPeriod,
      federalTaxPeriod: federalTax / payPeriodsPerYear,
      stateTaxPeriod: stateTax / payPeriodsPerYear,
      socialSecurityPeriod: socialSecurityTax / payPeriodsPerYear,
      medicarePeriod: medicareTax / payPeriodsPerYear,
      deductionsPeriod: deductionsPerPeriod,
      netPayPeriod: annualNet / payPeriodsPerYear,
      annualGross,
      annualNet,
      payPeriodsPerYear,
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const ResultDisplay = ({ result }: { result: PaycheckResult }) => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">
          Estimated Take-Home Pay (per period)
        </p>
        <p className="text-4xl font-bold font-headline">
          {formatCurrency(result.netPayPeriod)}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Per Pay Period</TableHead>
            <TableHead className="text-right">Annual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Gross Pay</TableCell>
            <TableCell className="text-right">
              {formatCurrency(result.grossPayPeriod)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(result.annualGross)}
            </TableCell>
          </TableRow>
          <TableRow className="text-muted-foreground">
            <TableCell>Pre-Tax Deductions</TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.deductionsPeriod)}
            </TableCell>
            <TableCell className="text-right">
              -
              {formatCurrency(
                result.deductionsPeriod * result.payPeriodsPerYear
              )}
            </TableCell>
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell>Federal Income Tax</TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.federalTaxPeriod)}
            </TableCell>
            <TableCell className="text-right">
              -
              {formatCurrency(
                result.federalTaxPeriod * result.payPeriodsPerYear
              )}
            </TableCell>
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell>State Income Tax</TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.stateTaxPeriod)}
            </TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.stateTaxPeriod * result.payPeriodsPerYear)}
            </TableCell>
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell>Social Security</TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.socialSecurityPeriod)}
            </TableCell>
            <TableCell className="text-right">
              -
              {formatCurrency(
                result.socialSecurityPeriod * result.payPeriodsPerYear
              )}
            </TableCell>
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell>Medicare</TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.medicarePeriod)}
            </TableCell>
            <TableCell className="text-right">
              -{formatCurrency(result.medicarePeriod * result.payPeriodsPerYear)}
            </TableCell>
          </TableRow>
          <TableRow className="bg-primary/10 text-primary font-bold">
            <TableCell>Net (Take-Home) Pay</TableCell>
            <TableCell className="text-right">
              {formatCurrency(result.netPayPeriod)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(result.annualNet)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>For Estimation Purposes Only (U.S.)</AlertTitle>
        <AlertDescription>
          This is a simplified estimate based on 2024 U.S. federal tax brackets and does not
          include local taxes, specific state deductions/credits, or other complex tax situations. Consult a qualified tax
          professional for exact figures.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="grossPay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gross Pay</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="filingStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Federal Filing Status (U.S.)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stateTaxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preTaxDeductions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pre-Tax Deductions (per pay period)</FormLabel>
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

export function PaycheckCalculatorPageClient({
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
      <PaycheckCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
