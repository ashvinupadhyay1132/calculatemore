
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// #region SGPA Calculator
const courseSchema = z.object({
  name: z.string().optional(),
  grade: z.string().nonempty("Please select a grade."),
  credits: z.coerce.number().positive("Credits must be a positive number."),
});

const sgpaFormSchema = z.object({
  courses: z.array(courseSchema).min(1, "Please add at least one course."),
});

const gradePoints: { [key: string]: number } = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0,
};

type SgpaResult = { gpa: number; totalCredits: number };

function SgpaCalculator({ setResult }: { setResult: (r: React.ReactNode) => void }) {
  const form = useForm<z.infer<typeof sgpaFormSchema>>({
    resolver: zodResolver(sgpaFormSchema),
    defaultValues: {
      courses: [
        { name: "Example: Engg. Physics", grade: "A+", credits: 4 },
        { name: "Example: Basic Electrical Engg.", grade: "A", credits: 3 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  function onSubmit(values: z.infer<typeof sgpaFormSchema>) {
    let totalPoints = 0;
    let totalCredits = 0;

    values.courses.forEach((course) => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setResult(<GpaResultDisplay result={{ gpa, totalCredits }} title="Semester GPA (SGPA)" />);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 mb-4 p-4 border rounded-lg relative">
              <div className="col-span-12 sm:col-span-5">
                <FormField control={form.control} name={`courses.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Course Name (Optional)</FormLabel><FormControl><Input placeholder="e.g. Physics 101" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                 <FormField control={form.control} name={`courses.${index}.grade`} render={({ field }) => (<FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{Object.entries(gradePoints).map(([grade, points]) => (<SelectItem key={grade} value={grade}>{grade} ({points})</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField control={form.control} name={`courses.${index}.credits`} render={({ field }) => (<FormItem><FormLabel>Credits</FormLabel><FormControl><Input type="number" placeholder="e.g. 3" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="col-span-12 sm:col-span-1 flex items-end">
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="w-full" disabled={fields.length <= 1}><X className="h-4 w-4" /><span className="sr-only">Remove course</span></Button>
              </div>
            </div>
          ))}
          <FormMessage>{form.formState.errors.courses?.message}</FormMessage>
        </div>
        <Button type="button" variant="outline" onClick={() => append({ grade: "A", credits: 3, name: "" })}><Plus className="mr-2 h-4 w-4" /> Add Course</Button>
        <Button type="submit" className="w-full">Calculate SGPA</Button>
      </form>
    </Form>
  );
}
// #endregion

// #region CGPA Calculator
const cgpaFormSchema = z.object({
    prevCredits: z.coerce.number().min(0, "Credits must be non-negative."),
    prevCgpa: z.coerce.number().min(0, "CGPA must be non-negative.").max(10, "CGPA cannot be more than 10."),
    currentSgpa: z.coerce.number().min(0, "SGPA must be non-negative.").max(10, "SGPA cannot be more than 10."),
    currentCredits: z.coerce.number().positive("Credits must be positive."),
});

type CgpaResult = { gpa: number; totalCredits: number };

function CgpaCalculator({ setResult }: { setResult: (r: React.ReactNode) => void }) {
    const form = useForm<z.infer<typeof cgpaFormSchema>>({
        resolver: zodResolver(cgpaFormSchema),
        defaultValues: { prevCredits: 60, prevCgpa: 8.5, currentSgpa: 9.2, currentCredits: 20 },
    });

    function onSubmit(values: z.infer<typeof cgpaFormSchema>) {
        const { prevCredits, prevCgpa, currentSgpa, currentCredits } = values;
        const totalPrevPoints = prevCredits * prevCgpa;
        const totalCurrentPoints = currentCredits * currentSgpa;
        const totalCredits = prevCredits + currentCredits;
        const newCgpa = (totalPrevPoints + totalCurrentPoints) / totalCredits;

        setResult(<GpaResultDisplay result={{ gpa: newCgpa, totalCredits }} title="Cumulative GPA (CGPA)" />);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold">Previous Semesters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <FormField control={form.control} name="prevCgpa" render={({ field }) => ( <FormItem><FormLabel>CGPA (Until Last Sem)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem> )} />
                         <FormField control={form.control} name="prevCredits" render={({ field }) => ( <FormItem><FormLabel>Total Credits (Until Last Sem)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                </div>
                 <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold">Current Semester</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="currentSgpa" render={({ field }) => ( <FormItem><FormLabel>Current Semester SGPA</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="currentCredits" render={({ field }) => ( <FormItem><FormLabel>Current Semester Credits</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                </div>
                <Button type="submit" className="w-full">Calculate CGPA</Button>
            </form>
        </Form>
    )
}
// #endregion

const GpaResultDisplay = ({ result, title }: { result: { gpa: number; totalCredits: number }, title: string }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">{title}</p>
      <p className="text-6xl font-bold font-headline">
        {result.gpa.toFixed(3)}
      </p>
      <p className="text-muted-foreground">
        based on {result.totalCredits} total credits.
      </p>
    </div>
);


export function CgpaSgpaCalculatorPageClient({
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
        <Tabs defaultValue="sgpa" className="w-full" onValueChange={() => setResult(null)}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sgpa">SGPA Calculator</TabsTrigger>
                <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
            </TabsList>
            <TabsContent value="sgpa">
                <SgpaCalculator setResult={setResult} />
            </TabsContent>
            <TabsContent value="cgpa">
                <CgpaCalculator setResult={setResult} />
            </TabsContent>
        </Tabs>
    </CalculatorPage>
  );
}
