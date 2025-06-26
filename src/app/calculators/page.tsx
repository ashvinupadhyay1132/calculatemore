import { CalculatorCard } from "@/components/calculator-card";
import { calculatorGroups } from "@/config/calculators";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Calculators - CalculateMore",
  description: "Explore our full suite of free online calculators for finance, health, academics, and math. Find the right tool for any calculation on CalculateMore.",
  keywords: ["online calculators", "free calculators", "calculator suite", "all calculators", "finance", "health", "math", "academic"],
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tighter lg:text-4xl">
          Welcome to CalculateMore
        </h1>
        <p className="text-muted-foreground">
          Select a calculator from the sidebar to get started, or explore our powerful categories below.
        </p>
      </div>

      <div className="space-y-8">
        {calculatorGroups.map((group) => (
            <div key={group.id}>
              <h2 className="font-headline text-2xl font-bold mb-4">{group.name} Calculators</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.calculators.map((calculator) => (
                    <CalculatorCard key={calculator.href} calculator={calculator} />
                ))}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
