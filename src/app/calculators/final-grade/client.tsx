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
import { Badge } from "@/components/ui/badge";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  currentGrade: z.coerce.number().min(0, "Grade must be positive."),
  goalGrade: z.coerce.number().min(0, "Goal must be positive."),
  finalWeight: z.coerce
    .number()
    .min(0, "Weight must be positive.")
    .max(100, "Weight cannot exceed 100."),
});

type GradeResult = {
  grade: number;
  message: string;
  variant: "success" | "warning" | "destructive";
};

function FinalGradeCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentGrade: 85,
      goalGrade: 90,
      finalWeight: 20,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { currentGrade, goalGrade, finalWeight } = values;
    const finalWeightDecimal = finalWeight / 100;

    if (finalWeightDecimal === 0) {
      if (goalGrade > currentGrade) {
        const resultData = {
          grade: Infinity,
          message:
            "It's impossible to reach your goal as the final has no weight.",
          variant: "destructive" as const,
        };
        setResult(<ResultDisplay result={resultData} />);
      } else {
        const resultData = {
          grade: -Infinity,
          message: "You have already met your goal grade!",
          variant: "success" as const,
        };
        setResult(<ResultDisplay result={resultData} />);
      }
      return;
    }

    let requiredGrade =
      (goalGrade - currentGrade * (1 - finalWeightDecimal)) /
      finalWeightDecimal;

    let resultData: GradeResult;
    if (requiredGrade > 100) {
      resultData = {
        grade: requiredGrade,
        message: "Reaching your goal may not be mathematically possible.",
        variant: "destructive",
      };
    } else if (requiredGrade <= 0) {
      resultData = {
        grade: 0,
        message:
          "You have already met your goal! You don't need any points from the final.",
        variant: "success",
      };
    } else {
      resultData = {
        grade: requiredGrade,
        message: "This is the minimum grade you need on your final exam.",
        variant: "warning",
      };
    }
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: GradeResult }) => (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">You need to score at least</p>
      <p className="text-6xl font-bold font-headline">
        {isFinite(result.grade) ? `${result.grade.toFixed(2)}%` : "N/A"}
      </p>
      <Badge variant={result.variant} className="text-base whitespace-normal">
        {result.message}
      </Badge>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Grade (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 85" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goalGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Final Grade (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 90" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="finalWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Exam Weight (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Calculate Required Grade
        </Button>
      </form>
    </Form>
  );
}

export function FinalGradeCalculatorPageClient({
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
      <FinalGradeCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
