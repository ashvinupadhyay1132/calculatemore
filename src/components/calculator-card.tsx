"use client";

import type { Calculator } from "@/config/calculators";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { Icons, type IconName } from "@/components/icons";

type CalculatorCardProps = {
  calculator: Calculator;
  className?: string;
};

export function CalculatorCard({ calculator, className }: CalculatorCardProps) {
  const Icon = Icons[calculator.icon as IconName];

  return (
    <Link href={calculator.href}>
      <Card
        className={cn(
          "flex flex-col justify-between rounded-lg p-4 transition-all hover:shadow-lg hover:-translate-y-1 h-full",
          className
        )}
      >
        <CardHeader className="flex-row gap-4 items-center p-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle className="font-headline text-lg">{calculator.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <CardDescription>{calculator.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
