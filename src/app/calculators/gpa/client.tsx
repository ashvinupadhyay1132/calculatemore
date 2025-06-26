
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const courseSchema = z.object({
  name: z.string().optional(),
  grade: z.string().nonempty("Please select a grade."),
  credits: z.coerce.number().positive("Credits must be a positive number."),
});

const formSchema = z.object({
  courses: z.array(courseSchema).min(1, "Please add at least one course."),
});

const gradePoints: { [key: string]: number } = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

type GpaResult = {
  gpa: number;
  totalCredits: number;
};

function GpaCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courses: [
        { name: "Example: Biology 101", grade: "A", credits: 3 },
        { name: "Example: History 205", grade: "B+", credits: 3 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let totalPoints = 0;
    let totalCredits = 0;

    values.courses.forEach((course) => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const resultData = { gpa, totalCredits };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: GpaResult }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">Your GPA is</p>
      <p className="text-6xl font-bold font-headline">
        {result.gpa.toFixed(2)}
      </p>
      <p className="text-muted-foreground">
        based on {result.totalCredits} total credits.
      </p>
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
                  name={`courses.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Biology 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name={`courses.${index}.grade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
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
                          {Object.entries(gradePoints).map(
                            ([grade, points]) => (
                              <SelectItem key={grade} value={grade}>
                                {grade} ({points.toFixed(1)})
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  control={form.control}
                  name={`courses.${index}.credits`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credits</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 3" {...field} />
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
                  <span className="sr-only">Remove course</span>
                </Button>
              </div>
            </div>
          ))}
          <FormMessage>{form.formState.errors.courses?.message}</FormMessage>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ grade: "A", credits: 3, name: "" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>

        <Button type="submit" className="w-full">
          Calculate GPA
        </Button>
      </form>
    </Form>
  );
}

export function GpaCalculatorPageClient({
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
      <GpaCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
