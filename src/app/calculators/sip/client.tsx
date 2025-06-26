
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
  ResponsiveContainer,
} from "recharts";
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
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


const formSchema = z.object({
  initialInvestment: z.coerce.number().min(0, "Cannot be negative.").default(0),
  sipAmount: z.coerce.number().positive("SIP amount must be a positive number."),
  sipFrequency: z.enum(["monthly", "quarterly", "semi-annually"]).default("monthly"),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative."),
  investmentDuration: z.coerce.number().int().positive("Duration must be a positive number of years."),
  annualStepUp: z.coerce.number().min(0, "Step-up cannot be negative.").default(0),
});

type ChartData = {
  year: number;
  value: number;
  invested: number;
  interest: number;
};

type SipResult = {
  totalValue: number;
  totalInterest: number;
  totalInvested: number;
  chartData: ChartData[];
  schedule: { year: number; invested: number; interest: number; balance: number }[];
};

function SipCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialInvestment: 100000,
      sipAmount: 10000,
      sipFrequency: "monthly",
      interestRate: 12,
      investmentDuration: 15,
      annualStepUp: 10,
    },
  });

  const sipFrequency = form.watch("sipFrequency");

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
        initialInvestment,
        sipAmount,
        sipFrequency,
        interestRate,
        investmentDuration,
        annualStepUp
    } = values;

    const totalMonths = investmentDuration * 12;
    const monthlyRate = interestRate / 100 / 12;
    const stepUpRate = annualStepUp / 100;
    
    let balance = initialInvestment;
    let totalInvested = initialInvestment;
    let totalInterest = 0;
    let currentSipAmount = sipAmount;

    const chartData: ChartData[] = [{ year: 0, value: balance, invested: totalInvested, interest: 0 }];
    const schedule: SipResult["schedule"] = [];

    const frequencyMonths = {
        monthly: 1,
        quarterly: 3,
        "semi-annually": 6
    };
    const sipInterval = frequencyMonths[sipFrequency];

    for (let i = 1; i <= totalMonths; i++) {
        const interestThisMonth = balance * monthlyRate;
        balance += interestThisMonth;
        totalInterest += interestThisMonth;

        if (i % sipInterval === 0) {
            balance += currentSipAmount;
            totalInvested += currentSipAmount;
        }

        if (i % 12 === 0) {
             schedule.push({
                year: i / 12,
                invested: totalInvested,
                interest: totalInterest,
                balance: balance
            });
            chartData.push({
                year: i / 12,
                value: parseFloat(balance.toFixed(2)),
                invested: parseFloat(totalInvested.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2))
            });
            if (i < totalMonths) { // Don't step-up after the final year
                currentSipAmount *= (1 + stepUpRate);
            }
        }
    }
    
    const resultData: SipResult = {
      totalValue: balance,
      totalInterest,
      totalInvested,
      chartData,
      schedule,
    };

    setResult(<ResultDisplay result={resultData} />);
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const ResultDisplay = ({ result }: { result: SipResult }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-4">
        <div>
          <p className="text-muted-foreground">Invested Amount</p>
          <p className="text-xl font-bold font-headline">{formatCurrency(result.totalInvested)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Est. Returns</p>
          <p className="text-xl font-bold font-headline">{formatCurrency(result.totalInterest)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Future Value</p>
          <p className="text-2xl font-bold font-headline text-primary">{formatCurrency(result.totalValue)}</p>
        </div>
      </div>
      <ChartContainer
        config={{
          value: { label: "Total Value", color: "hsl(var(--primary))" },
          invested: { label: "Invested", color: "hsl(var(--muted))" },
        }}
        className="h-[250px] w-full"
      >
        <AreaChart data={result.chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `Year ${value}`} />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} tickMargin={8} />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Area dataKey="invested" type="natural" fill="hsl(var(--muted))" stroke="hsl(var(--muted))" stackId="1" name="Invested" />
          <Area dataKey="interest" type="natural" fill="hsl(var(--primary))" fillOpacity={0.4} stroke="hsl(var(--primary))" stackId="1" name="Interest" />
        </AreaChart>
      </ChartContainer>

       <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">View Year-wise Breakdown</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Year-wise Breakdown</DialogTitle></DialogHeader>
                <ScrollArea className="h-[60vh]">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">Total Invested</TableHead>
                        <TableHead className="text-right">Total Interest</TableHead>
                        <TableHead className="text-right">Year-End Balance</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {result.schedule.map((row) => (
                        <TableRow key={row.year}>
                            <TableCell>{row.year}</TableCell>
                            <TableCell className="text-right">{formatCurrency(row.invested)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(row.balance)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
         <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>For Estimation Purposes Only</AlertTitle>
            <AlertDescription>
            This calculator provides a projection based on the inputs and does not account for taxes, fees, or market volatility. The actual returns may vary. Consult a qualified financial advisor for personalized advice.
            </AlertDescription>
        </Alert>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="initialInvestment" render={({ field }) => ( <FormItem><FormLabel>Initial Investment ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sipAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {sipFrequency === "monthly"
                    ? "Monthly"
                    : sipFrequency === "quarterly"
                    ? "Quarterly"
                    : "Semi-Annual"}{" "}
                  Investment ($)
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="sipFrequency" render={({ field }) => (
            <FormItem>
                <FormLabel>Investment Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                </SelectContent>
                </Select>
            </FormItem>
          )}/>
        </div>
        <FormField control={form.control} name="annualStepUp" render={({ field }) => ( <FormItem><FormLabel>Annual Step-up / Top-up (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="interestRate" render={({ field }) => ( <FormItem><FormLabel>Expected Return Rate (% p.a.)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="investmentDuration" render={({ field }) => ( <FormItem><FormLabel>Investment Duration (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}

export function SipCalculatorPageClient({
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
      <SipCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
