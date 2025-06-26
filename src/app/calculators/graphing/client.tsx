
"use client";

import type { Calculator } from "@/config/calculators";
import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import functionPlot from "function-plot";
import type { FunctionPlotOptions } from "function-plot/dist/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

const equationSchema = z.object({
  fn: z.string().min(1, "Equation cannot be empty."),
  color: z.string().optional(),
});

const formSchema = z.object({
  equations: z
    .array(equationSchema)
    .min(1, "Please add at least one equation."),
});

const defaultColors = [
  "#4285F4", // Google Blue
  "#DB4437", // Google Red
  "#F4B400", // Google Yellow
  "#0F9D58", // Google Green
];

export function GraphingCalculatorClient({
  calculator,
}: {
  calculator: Calculator;
}) {
  const graphRef = useRef<HTMLDivElement>(null);
  const [plotOptions, setPlotOptions] = useState<FunctionPlotOptions | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equations: [{ fn: "sin(x)", color: defaultColors[0] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "equations",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    const validEquations = values.equations
      .filter((eq) => eq.fn)
      .map((eq, index) => {
        const originalFn = eq.fn.trim();

        // Start with a minimal datum object and let the library use defaults
        const datum: any = {
          fn: originalFn,
          color: eq.color || defaultColors[index % defaultColors.length],
        };

        // Case 1: Implicit `f(x, y) = g(x, y)`
        // This must be checked before explicit `y = f(x)`
        if (originalFn.includes("y") && originalFn.includes("=")) {
          const parts = originalFn.split("=");
          if (parts.length === 2) {
            datum.fn = `(${parts[0]}) - (${parts[1]})`;
            datum.fnType = "implicit";
          }
        }
        // Case 2: Explicit `y = f(x)`
        else if (/^y\s*=/i.test(originalFn)) {
          datum.fn = originalFn.replace(/^y\s*=\s*/i, "");
        }

        // For all other cases (e.g. `sin(x)`), we don't need to do anything.
        // The library will use its default graphType.
        return datum;
      });

    if (validEquations.length > 0) {
      setPlotOptions({
        target: graphRef.current!,
        width: graphRef.current?.clientWidth,
        height: 500,
        grid: true,
        data: validEquations,
      });
    }
  }

  useEffect(() => {
    if (plotOptions && graphRef.current) {
      try {
        functionPlot(plotOptions);
      } catch (e: any) {
        console.error("Failed to plot function:", e);
        // Find first equation with error, not perfect but good enough
        const errIndex =
          plotOptions.data?.findIndex((d) => e.message.includes(d.fn!)) ?? 0;
        form.setError(`equations.${errIndex >= 0 ? errIndex : 0}.fn`, {
          type: "manual",
          message: e.message || "Invalid function.",
        });
      }
    }
  }, [plotOptions, form]);

  useEffect(() => {
    // Initial plot on load
    form.handleSubmit(onSubmit)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tighter">
          {calculator.title}
        </h1>
        <p className="text-muted-foreground">{calculator.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-end">
                      <FormField
                        control={form.control}
                        name={`equations.${index}.fn`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input
                                placeholder="e.g. x^2 or y=sin(x)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`equations.${index}.color`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="color"
                                className="p-1 h-10 w-10"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        fn: "",
                        color:
                          defaultColors[fields.length % defaultColors.length],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Equation
                  </Button>
                  <Button type="submit" className="w-full">
                    Plot Graph
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-2 h-full">
            <div ref={graphRef} className="w-full h-full min-h-[500px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
