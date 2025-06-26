
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// #region Safe Calculation Engine (Shunting-yard algorithm)
const precedence: { [key: string]: number } = {
  "+": 1,
  "-": 1,
  "×": 2,
  "÷": 2,
  "^": 3,
};

const associativity: { [key: string]: "Left" | "Right" } = {
  "+": "Left",
  "-": "Left",
  "×": "Left",
  "÷": "Left",
  "^": "Right",
};

const functions = ["sin", "cos", "tan", "log", "ln", "√"];

function tokenize(expression: string): (string | number)[] {
    // Regex to capture numbers, constants, functions, operators, parentheses, and a separate group for minus for unary detection
    const regex = /(\d+\.?\d*)|(π|e)|([a-z√]+)|([+\-×÷^()])|(-)/gi;
    const tokens: (string|number)[] = [];
    let match;
    while ((match = regex.exec(expression)) !== null) {
        if (match[1]) { // Number
            tokens.push(parseFloat(match[1]));
        } else { // Everything else is a string
            tokens.push(match[0]);
        }
    }

    // Handle unary minus
    const processedTokens = [];
    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === '-' && (i === 0 || ['(','+','-','×','÷','^'].includes(tokens[i-1] as string))) {
            const nextToken = tokens[i+1];
            if (typeof nextToken === 'number') {
                processedTokens.push(-nextToken);
                i++; // Skip next token
            } else if (nextToken ==='(' || functions.includes(nextToken as string)) {
                 processedTokens.push(-1);
                 processedTokens.push('×');
            } else {
                 processedTokens.push(token); // Regular minus
            }
        } else {
            processedTokens.push(token);
        }
    }
    return processedTokens;
}

function shuntingYard(tokens: (string | number)[]): (string | number)[] {
  const outputQueue: (string | number)[] = [];
  const operatorStack: string[] = [];

  tokens.forEach((token) => {
    if (typeof token === 'number') {
      outputQueue.push(token);
    } else if (token === "π") {
      outputQueue.push(Math.PI);
    } else if (token === "e") {
      outputQueue.push(Math.E);
    } else if (functions.includes(token as string)) {
      operatorStack.push(token as string);
    } else if (token in precedence) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        (precedence[operatorStack[operatorStack.length - 1]] > precedence[token as keyof typeof precedence] ||
          (precedence[operatorStack[operatorStack.length - 1]] === precedence[token as keyof typeof precedence] &&
            associativity[token as keyof typeof associativity] === "Left"))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token as string);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack[operatorStack.length - 1] === "(") {
        operatorStack.pop(); // Pop the left parenthesis
      }
       if (operatorStack.length > 0 && functions.includes(operatorStack[operatorStack.length - 1])) {
          outputQueue.push(operatorStack.pop()!);
      }
    }
  });

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === '(') throw new Error("Mismatched parentheses");
    outputQueue.push(op);
  }

  return outputQueue;
}

function calculateRPN(rpn: (string | number)[], isRadians: boolean): number {
  const stack: number[] = [];
  const toRadians = (deg: number) => deg * (Math.PI / 180);

  rpn.forEach((token) => {
    if (typeof token === "number") {
      stack.push(token);
    } else if (functions.includes(token as string)) {
      if (stack.length < 1) throw new Error("Invalid expression");
      let operand = stack.pop()!;
      switch (token) {
        case "sin": stack.push(Math.sin(isRadians ? operand : toRadians(operand))); break;
        case "cos": stack.push(Math.cos(isRadians ? operand : toRadians(operand))); break;
        case "tan": stack.push(Math.tan(isRadians ? operand : toRadians(operand))); break;
        case "log": stack.push(Math.log10(operand)); break;
        case "ln": stack.push(Math.log(operand)); break;
        case "√": stack.push(Math.sqrt(operand)); break;
      }
    } else {
      if (stack.length < 2) throw new Error("Invalid expression");
      const right = stack.pop()!;
      const left = stack.pop()!;
      switch (token) {
        case "+": stack.push(left + right); break;
        case "-": stack.push(left - right); break;
        case "×": stack.push(left * right); break;
        case "÷": 
            if (right === 0) throw new Error("Division by zero");
            stack.push(left / right);
            break;
        case "^": stack.push(Math.pow(left, right)); break;
      }
    }
  });
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

function evaluate(expression: string, isRadians: boolean): number | string {
    try {
        let processedExpr = expression;

        // Add implicit multiplication for parentheses, constants, and functions
        processedExpr = processedExpr.replace(/(\d+|\)|π|e)(?=\()/g, '$1×');      // 5( or )( or π(
        processedExpr = processedExpr.replace(/\)(?=(\d|[a-z√πe]))/g, ')×');    // )5 or )sin or )π
        processedExpr = processedExpr.replace(/(\d+|π|e)(?=[a-z√])/g, '$1×'); // 5sin or πsin or esin

        const tokens = tokenize(processedExpr);
        const rpn = shuntingYard(tokens);
        const result = calculateRPN(rpn, isRadians);

        if (isNaN(result)) return "Error";

        // Return integer if it's a whole number within tolerance, otherwise format
        if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-9 && result !== 0) ) {
            return result.toExponential(9);
        }
        return Number(result.toPrecision(15));

    } catch (error: any) {
        return error.message === "Division by zero" ? "Infinity" : "Error";
    }
}
// #endregion

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [isRadians, setIsRadians] = useState(true);

  const handleInput = (value: string) => {
    if (display === "Error" || display === "Infinity") {
      setDisplay(value);
      return;
    }
    
    if (display === "0" && !"+-×÷^.".includes(value)) {
        setDisplay(value);
    } else {
        setDisplay((prev) => prev + value);
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleBackspace = () => {
    if (display === "Error" || display === "Infinity") {
      setDisplay("0");
      return;
    }
    if (display.length > 1) {
      setDisplay((prev) => prev.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEquals = () => {
    if (!display || display === "Error") return;
    const result = evaluate(display, isRadians);
    setDisplay(String(result));
  };

  const handleSciOp = (op: string) => {
    if (display === "Error" || display === "Infinity") {
        setDisplay("0");
        return;
    }
    
    const isInitialZero = display === "0";

    switch (op) {
      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "ln":
      case "√":
        setDisplay(isInitialZero ? `${op}(` : display + `${op}(`);
        break;
      case "x²":
        handleInput("^2");
        break;
      case "π":
      case "e":
        setDisplay(isInitialZero ? op : display + op);
        break;
      default:
        return;
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="bg-muted text-right rounded-lg p-4 mb-4 text-3xl sm:text-4xl font-mono break-all h-[70px] flex items-center justify-end overflow-x-auto">
            {display}
          </div>
          <div className="flex justify-end gap-2 mb-2">
            <Button
              variant={isRadians ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsRadians(true)}
            >
              Rad
            </Button>
            <Button
              variant={!isRadians ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsRadians(false)}
            >
              Deg
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {/* Row 1 */}
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("sin")}>
              sin
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("cos")}>
              cos
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("tan")}>
              tan
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("log")}>
              log
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("ln")}>
              ln
            </Button>

            {/* Row 2 */}
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleInput("(")}>
              (
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleInput(")")}>
              )
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("√")}>
              √
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("x²")}>
              x²
            </Button>
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleInput("^")}>
              ^
            </Button>

            {/* Row 3 */}
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("π")}>
              π
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("7")}>
              7
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("8")}>
              8
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("9")}>
              9
            </Button>
            <Button variant="destructive" className="p-2 sm:p-3" onClick={() => handleInput("÷")}>
              ÷
            </Button>

            {/* Row 4 */}
            <Button variant="secondary" className="p-2 sm:p-3" onClick={() => handleSciOp("e")}>
              e
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("4")}>
              4
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("5")}>
              5
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("6")}>
              6
            </Button>
            <Button variant="destructive" className="p-2 sm:p-3" onClick={() => handleInput("×")}>
              ×
            </Button>

            {/* Row 5 */}
            <Button variant="secondary" className="p-2 sm:p-3" onClick={handleBackspace}>
              ⌫
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("1")}>
              1
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("2")}>
              2
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("3")}>
              3
            </Button>
            <Button variant="destructive" className="p-2 sm:p-3" onClick={() => handleInput("-")}>
              -
            </Button>

            {/* Row 6 */}
            <Button
              variant="secondary"
              onClick={handleClear}
              className="col-span-2 p-2 sm:p-3"
            >
              C
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput("0")}>
              0
            </Button>
            <Button variant="outline" className="p-2 sm:p-3" onClick={() => handleInput(".")}>
              .
            </Button>
            <Button variant="destructive" className="p-2 sm:p-3" onClick={() => handleInput("+")}>
              +
            </Button>

            <Button
              variant="default"
              className="col-span-5 p-2 sm:p-3"
              onClick={handleEquals}
            >
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
