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
import { Badge } from "@/components/ui/badge";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  units: z.enum(["metric", "imperial"]),
  height: z.coerce.number().positive("Height must be positive."),
  weight: z.coerce.number().positive("Weight must be positive."),
  heightInches: z.coerce.number().optional(),
});

type BmiResult = {
  bmi: number;
  category: string;
  categoryColor: "success" | "warning" | "destructive";
  healthyRange: string;
  weightToGoal: string;
};

function BmiCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: "metric",
      height: 180,
      weight: 75,
      heightInches: 0,
    },
  });

  const units = form.watch("units");

  function onSubmit(values: z.infer<typeof formSchema>) {
    let bmi = 0;
    let heightInMeters = 0;

    if (values.units === "metric") {
      heightInMeters = values.height / 100;
      bmi = values.weight / heightInMeters ** 2;
    } else {
      const heightInInches = values.height * 12 + (values.heightInches || 0);
      heightInMeters = heightInInches * 0.0254;
      bmi = (values.weight / heightInInches ** 2) * 703;
    }

    let category = "";
    let categoryColor: BmiResult["categoryColor"] = "warning";

    if (bmi < 18.5) {
      category = "Underweight";
      categoryColor = "warning";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      categoryColor = "success";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      categoryColor = "warning";
    } else {
      category = "Obesity";
      categoryColor = "destructive";
    }

    const minHealthyWeight = 18.5 * heightInMeters ** 2;
    const maxHealthyWeight = 24.9 * heightInMeters ** 2;
    const currentWeight =
      values.units === "metric" ? values.weight : values.weight * 0.453592;

    let weightToGoal = "";
    if (bmi >= 25) {
      const toLose = currentWeight - maxHealthyWeight;
      weightToGoal = `You may need to lose approximately ${toLose.toFixed(
        1
      )} kg (${(toLose * 2.20462).toFixed(1)} lbs) to reach a healthy BMI.`;
    } else if (bmi < 18.5) {
      const toGain = minHealthyWeight - currentWeight;
      weightToGoal = `You may need to gain approximately ${toGain.toFixed(
        1
      )} kg (${(toGain * 2.20462).toFixed(1)} lbs) to reach a healthy BMI.`;
    } else {
      weightToGoal = "You are within a healthy weight range.";
    }

    const healthyRange = `${minHealthyWeight.toFixed(1)}-${maxHealthyWeight.toFixed(
      1
    )} kg (${(minHealthyWeight * 2.20462).toFixed(1)}-${(
      maxHealthyWeight * 2.20462
    ).toFixed(1)} lbs)`;

    const resultData: BmiResult = {
      bmi,
      category,
      categoryColor,
      healthyRange,
      weightToGoal,
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: BmiResult }) => (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">Your BMI is</p>
      <p className="text-6xl font-bold font-headline">
        {result.bmi.toFixed(1)}
      </p>
      <Badge variant={result.categoryColor} className="text-lg">
        {result.category}
      </Badge>
      <div className="text-sm text-muted-foreground pt-4 space-y-2">
        <p>Healthy BMI range: 18.5 - 24.9</p>
        <p>
          Your healthy weight range is approximately: <br />
          <strong className="text-foreground">{result.healthyRange}</strong>
        </p>
        <p className="text-foreground">{result.weightToGoal}</p>
        <p className="text-xs pt-2">
          Note: BMI is a general indicator and may not be accurate for athletes,
          pregnant women, or the elderly. It does not distinguish between fat
          and muscle mass.
        </p>
      </div>
    </div>
  );

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
                    height: 0,
                    weight: 0,
                    heightInches: 0,
                  });
                  setResult(null);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">
                    Imperial (lbs, ft, in)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Weight ({units === "metric" ? "kg" : "lbs"})
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {units === "metric" ? (
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Height (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heightInches"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>(in)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <Button type="submit" className="w-full">
          Calculate BMI
        </Button>
      </form>
    </Form>
  );
}

export function BmiCalculatorPageClient({
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
      <BmiCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
