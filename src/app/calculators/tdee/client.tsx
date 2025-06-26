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
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const formSchema = z.object({
  units: z.enum(["metric", "imperial"]),
  age: z.coerce.number().int().positive("Age must be a positive number."),
  gender: z.enum(["male", "female"]),
  weight: z.coerce.number().positive("Weight must be positive."),
  height: z.coerce.number().positive("Height must be positive."),
  heightInches: z.coerce.number().optional().default(0),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very"]),
  formula: z.enum(["mifflin", "harris"]).default("mifflin"),
});

type TdeeResult = {
  tdee: number;
  bmr: number;
};

function TdeeCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: "metric",
      age: 30,
      gender: "female",
      activityLevel: "moderate",
      weight: 70,
      height: 170,
      heightInches: 0,
      formula: "mifflin",
    },
  });

  const units = form.watch("units");

  function onSubmit(values: z.infer<typeof formSchema>) {
    let weightInKg = values.weight;
    let heightInCm = values.height;

    if (values.units === "imperial") {
      weightInKg = values.weight * 0.453592;
      heightInCm = (values.height * 12 + (values.heightInches || 0)) * 2.54;
    }

    let bmr = 0;
    if (values.formula === "mifflin") {
      // Mifflin-St Jeor Equation
      if (values.gender === "male") {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * values.age + 5;
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * values.age - 161;
      }
    } else {
      // Revised Harris-Benedict Equation
      if (values.gender === "male") {
        bmr = 88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * values.age;
      } else {
        bmr = 447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.330 * values.age;
      }
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very: 1.9,
    };

    const tdee = bmr * activityMultipliers[values.activityLevel];
    const resultData = {
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
    };
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: TdeeResult }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">
        Your Total Daily Energy Expenditure (TDEE)
      </p>
      <p className="text-6xl font-bold font-headline">
        {result.tdee.toLocaleString()}
      </p>
      <p className="text-muted-foreground">calories/day</p>

      <div className="pt-4 text-sm text-muted-foreground space-y-2">
        <p>
          This is your estimated maintenance calories. To lose weight, consume
          fewer calories; to gain weight, consume more.
        </p>
        <p className="font-semibold text-foreground">
          Your Basal Metabolic Rate (BMR) is {result.bmr.toLocaleString()}{" "}
          calories. This is the energy your body burns at rest.
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
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
                    onValueChange={field.onChange}
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="activityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sedentary">
                    Sedentary (little or no exercise)
                  </SelectItem>
                  <SelectItem value="light">
                    Lightly active (light exercise/sports 1-3 days/week)
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderately active (moderate exercise/sports 3-5 days/week)
                  </SelectItem>
                  <SelectItem value="active">
                    Very active (hard exercise/sports 6-7 days a week)
                  </SelectItem>
                  <SelectItem value="very">
                    Extra active (very hard exercise/sports & physical job)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BMR Formula</FormLabel>
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
                  <SelectItem value="mifflin">
                    Mifflin-St Jeor (Most Accurate)
                  </SelectItem>
                  <SelectItem value="harris">
                    Revised Harris-Benedict
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Calculate TDEE
        </Button>
      </form>
    </Form>
  );
}

export function TdeeCalculatorPageClient({
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
      <TdeeCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
