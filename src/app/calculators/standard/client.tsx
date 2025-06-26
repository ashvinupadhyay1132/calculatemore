
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function StandardCalculator() {
  const [currentValue, setCurrentValue] = useState("0");
  const [operator, setOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  const displayValue = `${previousValue || ""} ${operator || ""}`.trim();

  const handleNumberClick = (num: string) => {
    if (currentValue === "Error") {
      setCurrentValue(num);
      setOverwrite(false);
      return;
    }
    if (overwrite) {
      setCurrentValue(num);
      setOverwrite(false);
    } else {
      if (num === "." && currentValue.includes(".")) return;
      setCurrentValue((prev) => (prev === "0" && num !== "." ? num : prev + num));
    }
  };

  const handleOperatorClick = (op: string) => {
    if (currentValue === "Error") return;
    if (previousValue !== null && !overwrite) {
      handleEquals(op); // Pass the new operator for chaining
    } else {
      setPreviousValue(currentValue);
      setOperator(op);
      setOverwrite(true);
    }
  };

  const handleEquals = (chainedOp: string | null = null) => {
    if (!operator || previousValue === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;

    switch (operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        if (current === 0) {
          setCurrentValue("Error");
          setPreviousValue(null);
          setOperator(null);
          setOverwrite(true);
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }
    const resultString = String(result);
    setCurrentValue(resultString);

    if (chainedOp) {
      setPreviousValue(resultString);
      setOperator(chainedOp);
    } else {
      setPreviousValue(null);
      setOperator(null);
    }
    setOverwrite(true);
  };

  const handleClear = () => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
  };

  const handleToggleSign = () => {
    if (currentValue !== "Error") {
      setCurrentValue((parseFloat(currentValue) * -1).toString());
    }
  };

  const handlePercent = () => {
    if (currentValue !== "Error") {
      if (previousValue) {
        // Calculate percentage of the previous value
        setCurrentValue(
          (
            (parseFloat(currentValue) / 100) *
            parseFloat(previousValue)
          ).toString()
        );
      } else {
        // Just divide by 100
        setCurrentValue((parseFloat(currentValue) / 100).toString());
      }
      setOverwrite(true);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="bg-muted text-right rounded-lg p-4 mb-4 text-4xl sm:text-5xl font-mono break-all h-[80px] flex flex-col items-end justify-end overflow-hidden">
            <div className="w-full text-muted-foreground text-xl h-6 text-right truncate">
              {displayValue}
            </div>
            <div className="w-full text-foreground h-12 text-right truncate">
              {currentValue}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-lg sm:text-xl">
            <Button
              variant="secondary"
              className="p-4 sm:p-6"
              onClick={handleClear}
            >
              C
            </Button>
            <Button
              variant="secondary"
              className="p-4 sm:p-6"
              onClick={handleToggleSign}
            >
              ±
            </Button>
            <Button
              variant="secondary"
              className="p-4 sm:p-6"
              onClick={handlePercent}
            >
              %
            </Button>
            <Button
              variant="destructive"
              className="p-4 sm:p-6"
              onClick={() => handleOperatorClick("÷")}
            >
              ÷
            </Button>

            {["7", "8", "9"].map((n) => (
              <Button
                key={n}
                variant="outline"
                className="p-4 sm:p-6"
                onClick={() => handleNumberClick(n)}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="destructive"
              className="p-4 sm:p-6"
              onClick={() => handleOperatorClick("×")}
            >
              ×
            </Button>

            {["4", "5", "6"].map((n) => (
              <Button
                key={n}
                variant="outline"
                className="p-4 sm:p-6"
                onClick={() => handleNumberClick(n)}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="destructive"
              className="p-4 sm:p-6"
              onClick={() => handleOperatorClick("-")}
            >
              -
            </Button>

            {["1", "2", "3"].map((n) => (
              <Button
                key={n}
                variant="outline"
                className="p-4 sm:p-6"
                onClick={() => handleNumberClick(n)}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="destructive"
              className="p-4 sm:p-6"
              onClick={() => handleOperatorClick("+")}
            >
              +
            </Button>

            <Button
              variant="outline"
              className="col-span-2 p-4 sm:p-6"
              onClick={() => handleNumberClick("0")}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="p-4 sm:p-6"
              onClick={() => handleNumberClick(".")}
            >
              .
            </Button>
            <Button
              variant="default"
              className="p-4 sm:p-6"
              onClick={() => handleEquals()}
            >
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
