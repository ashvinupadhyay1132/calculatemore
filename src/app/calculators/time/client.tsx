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
import { Plus, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalculatorPage } from "@/components/calculator-page";
import type { Calculator } from "@/config/calculators";

const timeSchema = z.object({
  hours: z.coerce.number().min(0).optional().default(0),
  minutes: z.coerce.number().min(0).optional().default(0),
  seconds: z.coerce.number().min(0).optional().default(0),
  operator: z.enum(["add", "sub"]),
});

const formSchema = z.object({
  times: z.array(timeSchema),
});

function TimeCalculatorForm({
  setResult,
}: {
  setResult: (result: React.ReactNode) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      times: [
        { hours: 2, minutes: 30, seconds: 0, operator: "add" },
        { hours: 1, minutes: 45, seconds: 15.5, operator: "add" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "times",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let totalSeconds = 0;

    values.times.forEach((time, index) => {
      const timeInSeconds =
        (time.hours || 0) * 3600 +
        (time.minutes || 0) * 60 +
        (time.seconds || 0);
      if (index === 0) {
        totalSeconds = timeInSeconds;
      } else {
        if (time.operator === "add") {
          totalSeconds += timeInSeconds;
        } else {
          totalSeconds -= timeInSeconds;
        }
      }
    });

    const sign = totalSeconds < 0 ? "-" : "";
    const totalSecondsAbs = Math.abs(totalSeconds);

    const hours = Math.floor(totalSecondsAbs / 3600);
    const minutes = Math.floor((totalSecondsAbs % 3600) / 60);
    const seconds = totalSecondsAbs % 60;

    const padInt = (num: number) => Math.floor(num).toString().padStart(2, "0");
    const secondsStr = seconds.toFixed(2).padStart(5, "0"); // 02.50

    const resultData = `${sign}${padInt(hours)}:${padInt(
      minutes
    )}:${secondsStr}`;
    setResult(<ResultDisplay result={resultData} />);
  }

  const ResultDisplay = ({ result }: { result: string }) => (
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">Total Time</p>
      <p className="text-6xl font-bold font-headline tabular-nums">{result}</p>
      <p className="text-muted-foreground">HH:MM:SS.ss</p>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-end gap-2 p-4 border rounded-lg"
            >
              {index > 0 && (
                <FormField
                  control={form.control}
                  name={`times.${index}.operator`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[70px]">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="add">
                            <Plus className="h-4 w-4 inline mr-2" />
                            Add
                          </SelectItem>
                          <SelectItem value="sub">
                            <Minus className="h-4 w-4 inline mr-2" />
                            Sub
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              <div
                className={cn(
                  "flex-grow grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:gap-2",
                  index === 0 && "w-full" 
                )}
              >
                <FormField
                  control={form.control}
                  name={`times.${index}.hours`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>H</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`times.${index}.minutes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>M</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`times.${index}.seconds`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>S</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove time value</span>
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ hours: 0, minutes: 0, seconds: 0, operator: "add" })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add another time value
        </Button>

        <Button type="submit" className="w-full">
          Calculate Total Time
        </Button>
      </form>
    </Form>
  );
}

export function TimeCalculatorPageClient({
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
      <TimeCalculatorForm setResult={setResult} />
    </CalculatorPage>
  );
}
