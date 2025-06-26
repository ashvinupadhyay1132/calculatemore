
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  units: z.enum(["metric", "imperial"]),
  gender: z.enum(["male", "female"]),
  weight: z.coerce.number().positive("Weight must be positive."),
  height: z.coerce.number().positive("Height must be positive."),
  neck: z.coerce.number().positive("Neck measurement must be positive."),
  waist: z.coerce.number().positive("Waist measurement must be positive."),
  hip: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
    if (data.gender === 'female') {
        if (!data.hip || data.hip <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["hip"],
                message: "A positive hip measurement is required for females.",
            });
        } else if ((data.waist + data.hip) <= data.neck) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["waist"],
                message: "The combination of Neck, Waist, and Hip measurements is not valid. Please double-check your inputs.",
            });
        }
    }
    if (data.gender === 'male') {
        if (data.waist <= data.neck) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["waist"],
                message: "The combination of Neck and Waist measurements is not valid. Please double-check your inputs.",
            });
        }
    }
});

type BodyFatResult = {
  bodyFatPercentage: number;
  fatMass: number;
  leanMass: number;
  category: string;
};

function BodyFatCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: "metric",
      gender: "male",
      weight: 75,
      height: 180,
      neck: 38,
      waist: 85,
    },
  });

  const { gender, units } = form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    let { height, neck, waist, hip, weight } = values;
    let heightIn = height;
    let neckIn = neck;
    let waistIn = waist;
    let hipIn = hip || 0;
    
    let weightInUnits = weight; // Use the weight as entered
    if (values.units === 'metric') {
        heightIn /= 2.54;
        neckIn /= 2.54;
        waistIn /= 2.54;
        hipIn /= 2.54;
    }

    let bfp = 0;
    if (values.gender === 'male') {
        bfp = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
    } else {
        bfp = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
    }

    bfp = Math.max(0, Math.min(100, bfp)); // Clamp between 0 and 100

    const fatMass = weightInUnits * (bfp / 100);
    const leanMass = weightInUnits - fatMass;

    const categories = {
        male: [
            { max: 5, label: "Essential Fat" },
            { max: 13, label: "Athletes" },
            { max: 17, label: "Fitness" },
            { max: 24, label: "Acceptable" },
            { max: Infinity, label: "Obesity" },
        ],
        female: [
            { max: 13, label: "Essential Fat" },
            { max: 20, label: "Athletes" },
            { max: 24, label: "Fitness" },
            { max: 31, label: "Acceptable" },
            { max: Infinity, label: "Obesity" },
        ],
    };

    const category = categories[values.gender].find(c => bfp <= c.max)?.label || "Unknown";

    const resultData = {
        bodyFatPercentage: bfp,
        fatMass,
        leanMass,
        category
    }

    setResult(<ResultDisplay result={resultData} units={units} />);
  }

  const ResultDisplay = ({ result, units }: { result: BodyFatResult, units: "metric" | "imperial" }) => {
      const unitLabel = units === 'metric' ? 'kg' : 'lbs';

      return (
            <div className="text-center space-y-4">
                <p className="text-muted-foreground">Estimated Body Fat</p>
                <p className="text-6xl font-bold font-headline">
                    {result.bodyFatPercentage.toFixed(1)}%
                </p>
                <Badge className="text-lg">{result.category}</Badge>
                
                <div className="grid grid-cols-2 gap-4 text-center !mt-6">
                    <div className="space-y-1 rounded-lg p-2 bg-muted/80">
                        <p className="text-muted-foreground">Fat Mass</p>
                        <p className="font-semibold text-lg">{result.fatMass.toFixed(1)} {unitLabel}</p>
                    </div>
                    <div className="space-y-1 rounded-lg p-2 bg-muted/80">
                        <p className="text-muted-foreground">Lean Mass</p>
                        <p className="font-semibold text-lg">{result.leanMass.toFixed(1)} {unitLabel}</p>
                    </div>
                </div>

                <p className="text-xs pt-2 text-muted-foreground">
                    Note: This is an estimate based on the U.S. Navy formula. Results may vary.
                </p>
            </div>
      );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Units</FormLabel>
               <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.reset({
                    units: value as "metric" | "imperial",
                    gender: form.getValues("gender"),
                    weight: 0,
                    height: 0,
                    neck: 0,
                    waist: 0,
                    hip: 0,
                  });
                  setResult(null);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biological Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.reset({
                        ...form.getValues(),
                        gender: value as "male" | "female",
                        weight: 0,
                        height: 0,
                        neck: 0,
                        waist: 0,
                        hip: 0,
                      });
                      setResult(null);
                    }}
                    defaultValue={field.value}
                    className="flex items-center space-x-4 pt-2"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Weight ({units === "metric" ? "kg" : "lbs"})</FormLabel>
                <FormControl><Input type="number" step="any" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Height ({units === "metric" ? "cm" : "in"})</FormLabel>
                <FormControl><Input type="number" step="any" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="neck"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Neck ({units === "metric" ? "cm" : "in"})</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
            control={form.control}
            name="waist"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Waist ({units === "metric" ? "cm" : "in"})</FormLabel>
                <FormControl><Input type="number" step="any" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        {gender === 'female' && (
            <FormField
              control={form.control}
              name="hip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hip ({units === "metric" ? "cm" : "in"})</FormLabel>
                  <FormControl><Input type="number" step="any" {...field} onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        )}

        <Button type="submit" className="w-full">
          Calculate Body Fat
        </Button>
      </form>
    </Form>
  );
}

export function BodyFatCalculatorPageClient({
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
      <BodyFatCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
