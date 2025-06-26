"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Fraction from "fraction.js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Separator } from "@/components/ui/separator";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  num1: z.coerce.number().int(),
  den1: z.coerce
    .number()
    .int()
    .refine((n) => n !== 0, "Denominator cannot be zero."),
  num2: z.coerce.number().int(),
  den2: z.coerce
    .number()
    .int()
    .refine((n) => n !== 0, "Denominator cannot be zero."),
  operator: z.enum(["add", "sub", "mul", "div"]),
});

type FractionResult = {
  fraction: string;
  decimal: number;
};

function FractionCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      num1: 1,
      den1: 2,
      num2: 3,
      den2: 4,
      operator: "add",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const frac1 = new Fraction(values.num1, values.den1);
    const frac2 = new Fraction(values.num2, values.den2);
    let res: Fraction;

    switch (values.operator) {
      case "add":
        res = frac1.add(frac2);
        break;
      case "sub":
        res = frac1.sub(frac2);
        break;
      case "mul":
        res = frac1.mul(frac2);
        break;
      case "div":
        if (values.num2 === 0) {
          form.setError("num2", {
            type: "manual",
            message: "Cannot divide by zero.",
          });
          return;
        }
        res = frac1.div(frac2);
        break;
    }

    const resultData = {
      fraction: res.toFraction(true),
      decimal: res.valueOf(),
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: FractionResult }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">Result</p>
      <p className="text-6xl font-bold font-headline">{result.fraction}</p>
      <p className="text-muted-foreground text-lg">
        Decimal:{" "}
        {result.decimal.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        })}
      </p>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap items-start justify-center gap-4">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center gap-1">
            <FormField
              control={form.control}
              name="num1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-20 text-center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="w-20" />
            <FormField
              control={form.control}
              name="den1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-20 text-center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Operator */}
          <FormField
            control={form.control}
            name="operator"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="add">+</SelectItem>
                    <SelectItem value="sub">-</SelectItem>
                    <SelectItem value="mul">×</SelectItem>
                    <SelectItem value="div">÷</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Fraction 2 */}
          <div className="flex flex-col items-center gap-1">
            <FormField
              control={form.control}
              name="num2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-20 text-center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="w-20" />
            <FormField
              control={form.control}
              name="den2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-20 text-center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}

export function FractionCalculatorPageClient({
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
      <FractionCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
