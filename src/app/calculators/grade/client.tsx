
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { X, Plus } from "lucide-react";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const gradeSchema = z.object({
  name: z.string().optional(),
  score: z.coerce.number().min(0, "Score cannot be negative."),
  weight: z.coerce.number().min(0, "Weight must be positive."),
});

const formSchema = z.object({
  grades: z.array(gradeSchema).min(1, "Please add at least one grade entry."),
});

type GradeResult = {
  grade: number;
  totalWeight: number;
};

function GradeCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grades: [
        { name: "Homework", score: 90, weight: 20 },
        { name: "Midterm Exam", score: 85, weight: 30 },
        { name: "Project", score: 95, weight: 50 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "grades",
  });

  const watchedGrades = form.watch("grades");

  const totalWeight = watchedGrades.reduce(
    (sum, grade) => sum + (grade.weight || 0),
    0
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    let weightedSum = 0;
    let totalWeight = 0;

    values.grades.forEach((grade) => {
      weightedSum += grade.score * (grade.weight / 100);
      totalWeight += grade.weight;
    });

    let finalGrade = 0;
    if (totalWeight > 0) {
      finalGrade = weightedSum / (totalWeight / 100);
    }

    const resultData = { grade: finalGrade, totalWeight };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: GradeResult }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">Your Weighted Grade is</p>
      <p className="text-6xl font-bold font-headline">
        {result.grade.toFixed(2)}%
      </p>
      {result.totalWeight !== 100 && (
        <p className="text-sm text-destructive-foreground bg-destructive/80 p-2 rounded-md">
          Warning: Total weight is {result.totalWeight}%, not 100%.
        </p>
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 mb-4 p-4 border rounded-lg relative"
            >
              <div className="col-span-12 sm:col-span-5">
                <FormField
                  control={form.control}
                  name={`grades.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Homework" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name={`grades.${index}.score`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 90" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name={`grades.${index}.weight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 sm:col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="w-full"
                  disabled={fields.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <FormMessage>{form.formState.errors.grades?.message}</FormMessage>
        </div>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", score: 0, weight: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Grade
          </Button>
          <div className="text-sm font-medium">
            Total Weight:{" "}
            <span className={totalWeight !== 100 ? "text-destructive" : ""}>
              {totalWeight}%
            </span>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Calculate Grade
        </Button>
      </form>
    </Form>
  );
}

export function GradeCalculatorPageClient({
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
      <GradeCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
