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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

// Schemas
const p1Schema = z.object({
  percentage: z.coerce.number(),
  value: z.coerce.number(),
});
const p2Schema = z.object({
  part: z.coerce.number(),
  whole: z.coerce.number().refine(n => n !== 0, "Cannot be zero."),
});
const p3Schema = z.object({
  from: z.coerce.number().refine(n => n !== 0, "Cannot be zero."),
  to: z.coerce.number(),
});

const ResultDisplay = ({ value }: { value: string }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">Result</p>
      <p className="text-6xl font-bold font-headline">{value}</p>
    </div>
  );

// Component for "What is X% of Y"
function PercentOfForm({ setResult }: { setResult: (r: React.ReactNode) => void }) {
  const form = useForm<z.infer<typeof p1Schema>>({
    resolver: zodResolver(p1Schema),
    defaultValues: { percentage: 15, value: 250 },
  });
  function onSubmit(values: z.infer<typeof p1Schema>) {
    const res = (values.percentage / 100) * values.value;
    setResult(<ResultDisplay value={res.toLocaleString()} />);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <label htmlFor="p1v1" className="whitespace-nowrap">What is</label>
          <FormField control={form.control} name="percentage" render={({ field }) => ( <FormItem><FormControl><Input type="number" {...field} className="w-28" /></FormControl><FormMessage /></FormItem> )} />
          <label htmlFor="p1v2" className="whitespace-nowrap">% of</label>
          <FormField control={form.control} name="value" render={({ field }) => ( <FormItem><FormControl><Input type="number" {...field} className="w-28" /></FormControl><FormMessage /></FormItem> )} />
          <span>?</span>
        </div>
        <Button type="submit" className="w-full">Calculate</Button>
      </form>
    </Form>
  );
}

// Component for "X is what % of Y"
function IsWhatPercentForm({ setResult }: { setResult: (r: React.ReactNode) => void }) {
  const form = useForm<z.infer<typeof p2Schema>>({
    resolver: zodResolver(p2Schema),
    defaultValues: { part: 40, whole: 160 },
  });
  function onSubmit(values: z.infer<typeof p2Schema>) {
    const res = (values.part / values.whole) * 100;
    setResult(<ResultDisplay value={`${res.toLocaleString()}%`} />);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <FormField control={form.control} name="part" render={({ field }) => ( <FormItem><FormControl><Input type="number" {...field} className="w-28" /></FormControl><FormMessage /></FormItem> )} />
          <label className="whitespace-nowrap">is what percent of</label>
          <FormField control={form.control} name="whole" render={({ field }) => ( <FormItem><FormControl><Input type="number" {...field} className="w-28" /></FormControl><FormMessage /></FormItem> )} />
          <span>?</span>
        </div>
        <Button type="submit" className="w-full">Calculate</Button>
      </form>
    </Form>
  );
}

// Component for "% increase/decrease"
function PercentChangeForm({ setResult }: { setResult: (r: React.ReactNode) => void }) {
  const form = useForm<z.infer<typeof p3Schema>>({
    resolver: zodResolver(p3Schema),
    defaultValues: { from: 120, to: 150 },
  });
  function onSubmit(values: z.infer<typeof p3Schema>) {
    const res = ((values.to - values.from) / values.from) * 100;
    setResult(<ResultDisplay value={`${Math.abs(res).toLocaleString()}% ${res > 0 ? "increase" : "decrease"}`} />);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="from" render={({ field }) => ( <FormItem><FormLabel>From</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="to" render={({ field }) => ( <FormItem><FormLabel>To</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <Button type="submit" className="w-full">Calculate</Button>
      </form>
    </Form>
  );
}

export function PercentageCalculatorPageClient({
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
      <Tabs defaultValue="p1" className="w-full" onValueChange={() => setResult(null)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="p1">X% of Y</TabsTrigger>
          <TabsTrigger value="p2">X is what %</TabsTrigger>
          <TabsTrigger value="p3">% Change</TabsTrigger>
        </TabsList>

        <TabsContent value="p1">
          <PercentOfForm setResult={setResult} />
        </TabsContent>
        <TabsContent value="p2">
          <IsWhatPercentForm setResult={setResult} />
        </TabsContent>
        <TabsContent value="p3">
          <PercentChangeForm setResult={setResult} />
        </TabsContent>
      </Tabs>
    </CalculatorPage>
  );
}
