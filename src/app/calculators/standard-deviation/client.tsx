
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  numbers: z.string().refine(
    (val) => {
      const numbers = val
        .trim()
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => !isNaN(n));
      return numbers.length >= 2;
    },
    {
      message:
        "Please enter at least two valid numbers separated by commas or spaces.",
    }
  ),
  type: z.enum(["sample", "population"]),
});

type StatResult = {
  count: number;
  sum: number;
  mean: number;
  variance: number;
  stdDev: number;
};

function StandardDeviationForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numbers: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
      type: "sample",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const numbers = values.numbers
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    const n = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance =
      numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      (values.type === "sample" ? n - 1 : n);
    const stdDev = Math.sqrt(variance);

    const resultData = {
      count: n,
      sum,
      mean,
      variance,
      stdDev,
    };

    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: StatResult }) => (
    <div className="space-y-2">
      <h4 className="font-headline text-lg text-center">Statistical Results</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Standard Deviation</TableCell>
            <TableCell className="text-right font-bold text-primary text-xl">{result.stdDev.toFixed(5)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Variance</TableCell>
            <TableCell className="text-right">{result.variance.toFixed(5)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mean</TableCell>
            <TableCell className="text-right">{result.mean.toFixed(5)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Count (n)</TableCell>
            <TableCell className="text-right">{result.count}</TableCell>
          </TableRow>
           <TableRow>
            <TableCell>Sum</TableCell>
            <TableCell className="text-right">{result.sum}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="numbers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Enter numbers separated by commas or spaces
              </FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4 pt-2"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="sample" />
                    </FormControl>
                    <FormLabel className="font-normal">Sample</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="population" />
                    </FormControl>
                    <FormLabel className="font-normal">Population</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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

export function StandardDeviationPageClient({
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
      <StandardDeviationForm setResult={setResult} />
    </CalculatorPage>
  );
}
