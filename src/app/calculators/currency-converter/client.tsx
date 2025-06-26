
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
import { ArrowRightLeft } from "lucide-react";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const currencies = [
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "KRW", name: "South Korean Won" },
];

// Fictional, static exchange rates for demonstration
const rates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.93,
  JPY: 157.32,
  GBP: 0.79,
  AUD: 1.51,
  CAD: 1.37,
  CHF: 0.9,
  CNY: 7.24,
  INR: 83.54,
  BRL: 5.25,
  RUB: 89.04,
  KRW: 1377.52,
};

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number."),
  from: z.string().nonempty("Please select a currency."),
  to: z.string().nonempty("Please select a currency."),
});

type ConversionResult = {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
};

function CurrencyConverterForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
      from: "USD",
      to: "EUR",
    },
  });

  const { from: fromCurrency, to: toCurrency } = form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { amount, from, to } = values;
    const fromRate = rates[from];
    const toRate = rates[to];

    if (fromRate && toRate) {
      const convertedAmount = (amount / fromRate) * toRate;
      const resultData = {
        fromAmount: amount,
        toAmount: convertedAmount,
        fromCurrency: from,
        toCurrency: to,
      };
      setResult(<ResultDisplay result={resultData} />);
    } else {
      console.error("Invalid currency selection.");
      setResult(null);
    }
  }

  const swapCurrencies = () => {
    form.setValue("from", toCurrency);
    form.setValue("to", fromCurrency);
  };

  const ResultDisplay = ({ result }: { result: ConversionResult }) => (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: result.fromCurrency,
        }).format(result.fromAmount)}{" "}
        is equal to
      </p>
      <p className="text-5xl font-bold font-headline">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: result.toCurrency,
          maximumFractionDigits: 2,
        }).format(result.toAmount)}
      </p>
      <p className="text-muted-foreground">{result.toCurrency}</p>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>From</FormLabel>
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
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={swapCurrencies}
            aria-label="Swap currencies"
            className="self-center sm:self-end"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>To</FormLabel>
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
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Convert
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Exchange rates are for demonstration purposes only and may not be
          real-time.
        </p>
      </form>
    </Form>
  );
}

export function CurrencyConverterPageClient({
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
      <CurrencyConverterForm setResult={setResult} />
    </CalculatorPage>
  );
}
