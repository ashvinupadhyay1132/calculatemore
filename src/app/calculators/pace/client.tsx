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
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  distance: z.coerce.number().positive("Distance must be positive."),
  distanceUnit: z.enum(["km", "miles"]),
  timeHours: z.coerce.number().min(0).default(0),
  timeMinutes: z.coerce.number().min(0).default(0),
  timeSeconds: z.coerce.number().min(0).default(0),
});

type PaceResult = {
  pacePerKm: string;
  pacePerMile: string;
};

function PaceCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distance: 5,
      distanceUnit: "km",
      timeHours: 0,
      timeMinutes: 25,
      timeSeconds: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const totalSeconds =
      (values.timeHours || 0) * 3600 +
      (values.timeMinutes || 0) * 60 +
      (values.timeSeconds || 0);
    
    if (totalSeconds === 0 || values.distance === 0) {
        setResult(null);
        return;
    }

    const distanceInKm =
      values.distanceUnit === "km" ? values.distance : values.distance * 1.60934;
    const distanceInMiles =
      values.distanceUnit === "miles" ? values.distance : values.distance / 1.60934;

    const secondsPerKm = totalSeconds / distanceInKm;
    const secondsPerMile = totalSeconds / distanceInMiles;
    
    const formatPace = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.round(totalSeconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    const resultData = {
      pacePerKm: formatPace(secondsPerKm),
      pacePerMile: formatPace(secondsPerMile),
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: PaceResult }) => (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">Your Pace</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-muted rounded-lg">
            <p className="text-lg font-semibold font-headline">{result.pacePerMile}</p>
            <p className="text-sm text-muted-foreground">per mile</p>
        </div>
         <div className="p-4 bg-muted rounded-lg">
            <p className="text-lg font-semibold font-headline">{result.pacePerKm}</p>
            <p className="text-sm text-muted-foreground">per kilometer</p>
        </div>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>Distance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distanceUnit"
            render={({ field }) => (
              <FormItem className="w-[100px]">
                <FormLabel>Unit</FormLabel>
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
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="miles">miles</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormLabel>Time</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <FormField
              control={form.control}
              name="timeHours"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="any" placeholder="hh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="any" placeholder="mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="any" placeholder="ss" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Calculate Pace
        </Button>
      </form>
    </Form>
  );
}

export function PaceCalculatorPageClient({
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
      <PaceCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
