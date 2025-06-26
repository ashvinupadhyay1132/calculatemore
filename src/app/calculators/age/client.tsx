
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  birthMonth: z.string({ required_error: "Month is required." }),
  birthDay: z.coerce.number({ required_error: "Day is required." }).int().min(1).max(31),
  birthYear: z.coerce.number({ required_error: "Year is required." }).int().min(1900),

  targetMonth: z.string().optional(),
  targetDay: z.coerce.number().int().min(1).max(31).optional(),
  targetYear: z.coerce.number().int().min(1900).optional(),
}).superRefine((data, ctx) => {
    // Validate birth date
    const birthDate = new Date(data.birthYear, parseInt(data.birthMonth) - 1, data.birthDay);
    if (birthDate.getFullYear() !== data.birthYear || birthDate.getMonth() !== parseInt(data.birthMonth) - 1 || birthDate.getDate() !== data.birthDay) {
        ctx.addIssue({
            code: z.ZodIssueCode.invalid_date,
            path: ["birthDay"],
            message: "Invalid date.",
        });
    } else if (birthDate > new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["birthYear"],
            message: "Birth date cannot be in the future.",
        });
    }

    // Validate target date if present
    const targetFields = [data.targetMonth, data.targetDay, data.targetYear];
    const targetFieldsPresentCount = targetFields.filter(v => v !== undefined && v !== null && v !== '').length;
    
    if (targetFieldsPresentCount > 0 && targetFieldsPresentCount < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetDay"],
        message: "Fill all target date fields or leave them all empty.",
      });
    } else if (targetFieldsPresentCount === 3) {
      const targetDate = new Date(data.targetYear!, parseInt(data.targetMonth!) - 1, data.targetDay!);
      if (targetDate.getFullYear() !== data.targetYear! || targetDate.getMonth() !== parseInt(data.targetMonth!) - 1 || targetDate.getDate() !== data.targetDay!) {
          ctx.addIssue({
              code: z.ZodIssueCode.invalid_date,
              path: ["targetDay"],
              message: "Invalid date.",
          });
      }
    }
});


type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
};

const months = [
    { value: "1", label: "January" }, { value: "2", label: "February" },
    { value: "3", label: "March" }, { value: "4", label: "April" },
    { value: "5", label: "May" }, { value: "6", label: "June" },
    { value: "7", label: "July" }, { value: "8", label: "August" },
    { value: "9", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" }
];

function AgeCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthYear: 2000,
      birthMonth: "1",
      birthDay: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { birthMonth, birthDay, birthYear, targetMonth, targetDay, targetYear } = values;

    const birthDate = new Date(birthYear, parseInt(birthMonth) - 1, birthDay);
    
    let targetDate = new Date(); // Default to today
    if (targetMonth && targetDay && targetYear) {
      targetDate = new Date(targetYear, parseInt(targetMonth) - 1, targetDay);
    }
    
    const totalYears = differenceInYears(targetDate, birthDate);
    
    let tempDate = new Date(birthDate);
    tempDate.setFullYear(tempDate.getFullYear() + totalYears);
    const totalMonths = differenceInMonths(targetDate, tempDate);
    
    tempDate.setMonth(tempDate.getMonth() + totalMonths);
    const totalDays = differenceInDays(targetDate, tempDate);

    const resultData: AgeResult = {
        years: totalYears,
        months: totalMonths,
        days: totalDays,
        totalMonths: differenceInMonths(targetDate, birthDate),
        totalDays: differenceInDays(targetDate, birthDate),
        totalHours: differenceInHours(targetDate, birthDate),
        totalMinutes: differenceInMinutes(targetDate, birthDate),
        totalSeconds: differenceInSeconds(targetDate, birthDate),
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: AgeResult }) => (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">Your Age is</p>
      <p className="text-5xl font-bold font-headline">
        {result.years} years, {result.months} months, {result.days} days
      </p>
      <div className="text-sm text-muted-foreground pt-4 space-y-2">
        <p>Or {result.totalMonths.toLocaleString()} months</p>
        <p>Or {result.totalDays.toLocaleString()} days</p>
        <p>Or {result.totalHours.toLocaleString()} hours</p>
        <p>Or {result.totalMinutes.toLocaleString()} minutes</p>
        <p>Or {result.totalSeconds.toLocaleString()} seconds</p>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormLabel>Date of Birth</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <FormField
              control={form.control}
              name="birthMonth"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDay"
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input type="number" placeholder="Day" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthYear"
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input type="number" placeholder="Year" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <FormLabel>Age at Date of (optional)</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <FormField
              control={form.control}
              name="targetMonth"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetDay"
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input type="number" placeholder="Day" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetYear"
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input type="number" placeholder="Year" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Calculate Age
        </Button>
      </form>
    </Form>
  );
}

export function AgeCalculatorPageClient({
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
      <AgeCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
