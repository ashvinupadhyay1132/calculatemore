
import type { IconName } from "@/components/icons";

export type Calculator = {
  title: string;
  href: string;
  description: string;
  icon: IconName;
  keywords: string[];
  faq: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
};

export type CalculatorGroup = {
  id: string;
  name: string;
  description: string;
  calculators: Calculator[];
};

const financialCalculators: Calculator[] = [
  {
    title: "Mortgage Calculator",
    href: "/calculators/mortgage",
    description: "Accurately estimate your monthly mortgage payment with our advanced calculator, including principal, interest, taxes, and insurance (PITI).",
    icon: "Home",
    keywords: ["mortgage calculator", "home loan calculator", "mortgage payment calculator", "piti calculator", "housing loan estimator", "real estate finance"],
    faq: [
        { "@type": "Question", name: "What is PITI?", acceptedAnswer: { "@type": "Answer", text: "PITI stands for Principal, Interest, Taxes, and Insurance. These are the four main components of a monthly mortgage payment." } },
        { "@type": "Question", name: "How does down payment affect my mortgage?", acceptedAnswer: { "@type": "Answer", text: "A larger down payment reduces your loan amount, which lowers your monthly payment and total interest paid. It can also help you avoid paying for Private Mortgage Insurance (PMI)." } },
        { "@type": "Question", name: "What is a good mortgage interest rate?", acceptedAnswer: { "@type": "Answer", text: "Interest rates vary based on market conditions, your credit score, loan term, and down payment. It's best to compare offers from multiple lenders to find a competitive rate." } }
    ]
  },
  {
    title: "SIP Calculator",
    href: "/calculators/sip",
    description: "Calculate the future value of your Systematic Investment Plan (SIP) with options for annual step-up, frequency, and an initial lump sum.",
    icon: "LineChart",
    keywords: ["sip calculator", "systematic investment plan", "sip return calculator", "sip step-up calculator", "lump sum sip", "investment calculator india"],
    faq: [
        { "@type": "Question", name: "What is a Systematic Investment Plan (SIP)?", acceptedAnswer: { "@type": "Answer", text: "A Systematic Investment Plan (SIP) is a method of investing where you contribute a fixed amount of money at regular intervals (e.g., monthly) into a mutual fund or other investment vehicle. It promotes disciplined investing and helps average out the cost of your investment over time." } },
        { "@type": "Question", name: "What is a SIP 'step-up' or 'top-up'?", acceptedAnswer: { "@type": "Answer", text: "A SIP step-up, or top-up, is when you increase your periodic investment amount at regular intervals, typically annually. This feature, which our calculator supports, can significantly accelerate your wealth creation by aligning your investments with your increasing income." } },
        { "@type": "Question", name: "How does SIP help in rupee cost averaging?", acceptedAnswer: { "@type": "Answer", text: "Rupee cost averaging (or dollar-cost averaging) is an investment strategy that aims to reduce the impact of volatility. When you invest a fixed amount regularly, you buy more units when prices are low and fewer units when prices are high. This can lower the average cost per unit over time." } }
    ]
  },
  {
    title: "Compound Interest Calculator",
    href: "/calculators/compound-interest",
    description: "Calculate the future value of your investment by projecting its growth over time with compound interest and optional periodic contributions.",
    icon: "AreaChart",
    keywords: ["compound interest calculator", "investment growth calculator", "future value calculator", "savings calculator", "financial projection tool", "roi calculator"],
     faq: [
        { "@type": "Question", name: "What is compound interest?", acceptedAnswer: { "@type": "Answer", text: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. It's often called 'interest on interest', and it's what makes investments grow exponentially over time." } },
        { "@type": "Question", name: "How often is interest typically compounded?", acceptedAnswer: { "@type": "Answer", text: "Compounding frequency can be daily, weekly, monthly, quarterly, semi-annually, or annually. The more frequently interest is compounded, the faster your investment grows. Our calculator lets you select the frequency to see the difference." } },
        { "@type": "Question", name: "What is the difference between interest rate and APY?", acceptedAnswer: { "@type": "Answer", text: "The interest rate (or nominal rate) is the stated rate of interest. The Annual Percentage Yield (APY) is the effective annual rate of return taking into account the effect of compounding. APY will always be higher than the nominal rate if compounding occurs more than once per year." } }
    ]
  },
   {
    title: "Retirement Calculator",
    href: "/calculators/retirement",
    description: "Plan for your future by estimating your retirement savings growth and potential income. See how your contributions can build a secure nest egg.",
    icon: "Users",
    keywords: ["retirement calculator", "401k calculator", "pension calculator", "retirement savings", "nest egg calculator", "retirement planning"],
    faq: [
      { "@type": "Question", name: "How much do I need to save for retirement?", acceptedAnswer: { "@type": "Answer", text: "A common rule of thumb is to save at least 15% of your pre-tax income each year for retirement. However, the exact amount depends on your desired lifestyle, retirement age, and current savings. This calculator helps you visualize your potential savings." } },
      { "@type": "Question", name: "What is a good rate of return for retirement investments?", acceptedAnswer: { "@type": "Answer", text: "Historically, the average stock market return is about 10% per year. However, a more conservative estimate for long-term planning is often between 6-8%, which accounts for inflation and fees. You can adjust this rate in our calculator." } },
      { "@type": "Question", name: "How does inflation affect my retirement savings?", acceptedAnswer: { "@type": "Answer", text: "Inflation reduces the purchasing power of your money over time. Our calculator includes an inflation rate field to show you what your final balance might be worth in today's dollars, giving you a more realistic picture of your financial future." } }
    ]
  },
  {
    title: "Savings Calculator",
    href: "/calculators/savings",
    description: "Plan your savings goals and determine how long it will take to reach them with our easy-to-use savings calculator. Tracks growth with interest.",
    icon: "PiggyBank",
    keywords: ["savings calculator", "savings goal calculator", "how long to save", "investment timeline", "goal-based savings", "financial goal planner"],
    faq: [
        { "@type": "Question", name: "How can I reach my savings goal faster?", acceptedAnswer: { "@type": "Answer", text: "You can reach your savings goal faster by increasing your monthly contribution, finding an investment with a higher rate of return, or making a larger initial deposit. This calculator helps you see how those changes affect your timeline." } },
        { "@type": "Question", name: "Does this calculator account for inflation?", acceptedAnswer: { "@type": "Answer", text: "This calculator focuses on the nominal growth of your savings based on contributions and interest. For understanding the impact of inflation on your future savings, please use our separate Inflation Calculator." } },
        { "@type": "Question", name: "What is a realistic interest rate for a savings account?", acceptedAnswer: { "@type": "Answer", text: "Interest rates vary widely. A standard savings account might offer less than 1%, while a high-yield savings account could offer 4-5% or more. Investment accounts have the potential for higher returns but also carry more risk." } }
    ]
  },
  {
    title: "Loan Calculator",
    href: "/calculators/loan",
    description: "Estimate your monthly payments and total interest cost for various types of loans, such as personal loans, student loans, or other fixed-rate financing.",
    icon: "Coins",
     keywords: ["loan calculator", "loan payment calculator", "personal loan calculator", "amortization calculator", "loan interest calculator", "student loan calculator"],
     faq: [
        { "@type": "Question", name: "What is amortization?", acceptedAnswer: { "@type": "Answer", text: "Amortization is the process of paying off a debt over time in regular installments. Each payment consists of both principal and interest. Our calculator provides a full amortization schedule so you can see this breakdown." } },
        { "@type": "Question", name: "How can I lower my monthly loan payment?", acceptedAnswer: { "@type": "Answer", text: "You can potentially lower your monthly payment by finding a loan with a lower interest rate, extending the loan term (which usually increases total interest paid), or borrowing a smaller amount." } },
        { "@type": "Question", name: "What is APR?", acceptedAnswer: { "@type": "Answer", text: "APR, or Annual Percentage Rate, is the total cost of borrowing money over a year, including the interest rate and any associated fees. When comparing loans, the APR is often a more complete measure than the interest rate alone." } }
    ]
  },
  {
    title: "Car Loan Calculator",
    href: "/calculators/car-loan",
    description: "Calculate your monthly car payment and the total cost of your auto loan, including principal and interest. Essential for smart car buying.",
    icon: "Car",
    keywords: ["car loan calculator", "auto loan calculator", "car payment calculator", "vehicle financing", "auto loan interest", "car finance"],
    faq: [
        { "@type": "Question", name: "What is a good interest rate for a car loan?", acceptedAnswer: { "@type": "Answer", text: "Car loan interest rates depend on your credit score, the loan term, and whether the car is new or used. Typically, a higher credit score will get you a lower interest rate. It's wise to get pre-approved from your bank before visiting a dealership." } },
        { "@type": "Question", name: "Should I make a down payment on a car loan?", acceptedAnswer: { "@type": "Answer", text: "Yes, making a down payment is highly recommended. It reduces your loan amount, lowers your monthly payments, and helps you build equity in the vehicle faster, reducing the risk of being 'upside down' on your loan (owing more than the car is worth)." } },
        { "@type": "Question", name: "How does the loan term affect my car payment?", acceptedAnswer: { "@type": "Answer", text: "A longer loan term (e.g., 72 or 84 months) will result in a lower monthly payment, but you will pay significantly more in total interest over the life of the loan. A shorter term saves you money in the long run." } }
    ]
  },
  {
    title: "Paycheck Calculator",
    href: "/calculators/paycheck",
    description: "Estimate your take-home pay (net pay) after federal, state, and FICA taxes, as well as pre-tax deductions. See a detailed breakdown of your paycheck.",
    icon: "Wallet",
    keywords: ["paycheck calculator", "take home pay calculator", "net pay calculator", "salary calculator", "payroll deductions calculator", "gross to net"],
     faq: [
        { "@type": "Question", name: "What are FICA taxes?", acceptedAnswer: { "@type": "Answer", text: "FICA stands for the Federal Insurance Contributions Act. It's a U.S. federal payroll tax that funds Social Security (6.2%) and Medicare (1.45%). Your employer also pays a matching amount." } },
        { "@type": "Question", name: "What are pre-tax deductions?", acceptedAnswer: { "@type": "Answer", text: "Pre-tax deductions are funds taken out of your gross pay before taxes are calculated, which lowers your taxable income. Common examples include contributions to a 401(k) retirement plan, Health Savings Account (HSA), or certain health insurance premiums." } },
        { "@type": "Question", name: "Is this calculator accurate for all US states?", acceptedAnswer: { "@type": "Answer", text: "This calculator provides a strong estimate. However, state and local taxes can be very complex, with different deductions and credits. For precise figures, it's always best to consult an official state tax resource or a qualified tax professional." } }
    ]
  },
  {
    title: "Inflation Calculator",
    href: "/calculators/inflation",
    description: "Calculate the future value of money and see how inflation impacts purchasing power over time. Understand the true cost of holding cash.",
    icon: "TrendingUp",
    keywords: ["inflation calculator", "purchasing power calculator", "value of money calculator", "economic inflation", "real return calculator", "cpi calculator"],
    faq: [
        { "@type": "Question", name: "What is inflation?", acceptedAnswer: { "@type": "Answer", text: "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. For example, if the inflation rate is 2%, then a $1 pack of gum will cost $1.02 in a year." } },
        { "@type": "Question", name: "What is purchasing power?", acceptedAnswer: { "@type": "Answer", text: "Purchasing power is the value of a currency expressed in terms of the amount of goods or services that one unit of money can buy. Inflation decreases purchasing power over time. This calculator shows you how much the buying power of your money changes." } },
        { "@type": "Question", name: "What is the Consumer Price Index (CPI)?", acceptedAnswer: { "@type": "Answer", text: "The Consumer Price Index (CPI) is a measure that examines the weighted average of prices of a basket of consumer goods and services, such as transportation, food, and medical care. It is a primary way to measure inflation." } }
    ]
  },
  {
    title: "Currency Converter",
    href: "/calculators/currency-converter",
    description: "Perform fast and easy currency conversions between major world currencies using our straightforward exchange rate calculator.",
    icon: "ArrowRightLeft",
    keywords: ["currency converter", "exchange rate calculator", "forex calculator", "money converter", "convert USD to EUR", "convert INR to USD"],
     faq: [
        { "@type": "Question", name: "What is an exchange rate?", acceptedAnswer: { "@type": "Answer", text: "An exchange rate is the value of one nation's currency versus the currency of another nation or economic zone. For example, it tells you how many U.S. dollars you need to buy one Euro." } },
        { "@type": "Question", name: "Are these exchange rates real-time?", acceptedAnswer: { "@type": "Answer", text: "The rates in this calculator are for demonstration purposes and are not updated in real-time. For actual financial transactions, you should consult a financial institution for the current exchange rates." } },
        { "@type": "Question", name: "What is a 'spread' in currency exchange?", acceptedAnswer: { "@type": "Answer", text: "The spread is the difference between the 'buy' and 'sell' price for a currency. It's how currency exchange services make a profit. The rates you see online are often 'mid-market' rates, without the spread applied." } }
    ]
  },
   {
    title: "EMI Calculator",
    href: "/calculators/emi",
    description: "Quickly calculate your Equated Monthly Installment (EMI) for any type of loan. See a breakdown of principal and interest payments.",
    icon: "Landmark",
    keywords: ["emi calculator", "equated monthly installment", "loan emi calculator", "personal loan emi", "home loan emi", "car loan emi"],
    faq: [
        { "@type": "Question", name: "What does EMI stand for?", acceptedAnswer: { "@type": "Answer", text: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. It includes both principal and interest components." } },
        { "@type": "Question", name: "How is EMI calculated?", acceptedAnswer: { "@type": "Answer", text: "EMI is calculated using the formula: P x R x (1+R)^N / [(1+R)^N-1], where P is the principal loan amount, R is the monthly interest rate, and N is the number of monthly installments. Our calculator handles this for you automatically." } },
        { "@type": "Question", name: "What is the difference between reducing balance and flat rate interest?", acceptedAnswer: { "@type": "Answer", text: "In a reducing balance method (used by this calculator), interest is calculated each month on the outstanding loan amount. In a flat rate method, interest is calculated on the initial principal amount for the entire loan period, which is generally more expensive for the borrower." } }
    ]
  },
];

const healthCalculators: Calculator[] = [
  {
    title: "BMI Calculator",
    href: "/calculators/bmi",
    description: "Calculate your Body Mass Index (BMI) to assess your body weight relative to your height. A key indicator of overall health.",
    icon: "HeartPulse",
    keywords: ["bmi calculator", "body mass index calculator", "healthy weight calculator", "bmi chart", "what is my bmi", "obesity calculator"],
    faq: [
        { "@type": "Question", name: "What is BMI?", acceptedAnswer: { "@type": "Answer", text: "Body Mass Index (BMI) is a measure that uses your height and weight to work out if your weight is healthy. The calculation divides an adult's weight in kilograms by their height in metres squared." } },
        { "@type": "Question", name: "Is BMI always accurate?", acceptedAnswer: { "@type": "Answer", text: "BMI is a useful general indicator but has limitations. It does not distinguish between fat and muscle mass, so very muscular individuals (like athletes) may have a high BMI but low body fat. It may also not be accurate for pregnant women or the elderly." } },
        { "@type": "Question", name: "What are the standard BMI categories?", acceptedAnswer: { "@type": "Answer", text: "The standard BMI categories are: Below 18.5 (Underweight), 18.5-24.9 (Normal weight), 25.0-29.9 (Overweight), and 30.0 and above (Obesity)." } }
    ]
  },
  {
    title: "Calorie Calculator",
    href: "/calculators/calorie",
    description: "Estimate your daily calorie needs to maintain, lose, or gain weight based on your age, gender, height, weight, and activity level.",
    icon: "Flame",
    keywords: ["calorie calculator", "daily calorie needs", "weight loss calculator", "maintenance calories", "calorie intake calculator", "macro calculator"],
    faq: [
        { "@type": "Question", name: "How many calories should I eat to lose weight?", acceptedAnswer: { "@type": "Answer", text: "To lose weight, you need to consume fewer calories than your body burns. A common recommendation is to create a deficit of 500 calories per day to lose about 1 pound (0.45 kg) per week. This calculator helps you find your starting point." } },
        { "@type": "Question", name: "What equation does this calculator use?", acceptedAnswer: { "@type": "Answer", text: "This calculator uses the Mifflin-St Jeor equation by default, which is widely considered one of the most accurate formulas for calculating Basal Metabolic Rate (BMR). It also includes the Revised Harris-Benedict equation as an alternative." } },
        { "@type": "Question", name: "What is a calorie deficit?", acceptedAnswer: { "@type": "Answer", text: "A calorie deficit is a state in which you burn more calories than you consume. This is the fundamental principle of weight loss. For example, if your maintenance calories are 2000 per day, eating 1500 calories per day would create a 500-calorie deficit." } }
    ]
  },
  {
    title: "TDEE Calculator",
    href: "/calculators/tdee",
    description: "Calculate your Total Daily Energy Expenditure (TDEE) to find your total maintenance calories, including all physical activity.",
    icon: "Bike",
    keywords: ["tdee calculator", "total daily energy expenditure", "maintenance calories calculator", "activity level calculator", "bmr calculator", "cutting and bulking calories"],
    faq: [
        { "@type": "Question", name: "What is the difference between BMR and TDEE?", acceptedAnswer: { "@type": "Answer", text: "BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest. TDEE (Total Daily Energy Expenditure) is your BMR plus the calories you burn through all activities, including exercise, digestion, and daily movements. TDEE represents your total daily 'maintenance' calories." } },
        { "@type": "Question", name: "Why is knowing my TDEE important?", acceptedAnswer: { "@type": "Answer", text: "Knowing your TDEE is crucial for weight management. To lose weight (a 'cut'), you eat fewer calories than your TDEE. To gain muscle (a 'bulk'), you eat more than your TDEE. To maintain your current weight, you eat at your TDEE." } },
        { "@type": "Question", name: "How do I choose the right activity level?", acceptedAnswer: { "@type": "Answer", text: "Be honest with yourself. 'Sedentary' is a desk job with no exercise. 'Lightly active' might be a desk job plus 1-3 workouts per week. 'Moderately active' is more frequent or intense exercise. If you are unsure, it's often better to slightly underestimate your activity level." } }
    ]
  },
    {
    title: "Body Fat Calculator",
    href: "/calculators/body-fat",
    description: "Estimate your body fat percentage using the U.S. Navy method. A useful metric for tracking fitness progress beyond just weight.",
    icon: "PersonStanding",
    keywords: ["body fat calculator", "navy body fat calculator", "body composition", "fitness calculator", "health metrics", "lean mass calculator"],
    faq: [
        { "@type": "Question", name: "What is the U.S. Navy method?", acceptedAnswer: { "@type": "Answer", text: "The U.S. Navy Body Fat Calculator uses a formula based on height, waist, neck, and (for women) hip measurements to estimate body fat percentage. It's a widely used and accessible method that doesn't require special equipment like calipers." } },
        { "@type": "Question", name: "Why is body fat percentage a better metric than BMI?", acceptedAnswer: { "@type": "Answer", text: "While BMI is useful, body fat percentage provides a more accurate picture of your health and fitness by distinguishing between fat mass and lean mass. An athlete and an inactive person could have the same BMI but vastly different body fat percentages." } },
        { "@type": "Question", name: "What are healthy body fat percentage ranges?", acceptedAnswer: { "@type": "Answer", text: "For men, a 'Fitness' level is typically 14-17%, while for women it's 21-24%. These are just general guidelines, and the ideal percentage can vary based on age and personal goals." } }
    ]
  },
  {
    title: "Pace Calculator",
    href: "/calculators/pace",
    description: "Calculate your running pace, time, or distance. An essential tool for runners to plan their training and race strategies.",
    icon: "Rabbit",
    keywords: ["pace calculator", "running calculator", "race pace", "run time calculator", "running speed", "minutes per mile", "marathon pace"],
    faq: [
        { "@type": "Question", name: "How is running pace calculated?", acceptedAnswer: { "@type": "Answer", text: "Running pace is calculated by dividing the total time of a run by the distance covered. This calculator can solve for pace, time, or distance if you provide the other two variables." } },
        { "@type": "Question", name: "What is the difference between pace and speed?", acceptedAnswer: { "@type": "Answer", text: "Pace is typically measured in time per unit of distance (e.g., minutes per mile or minutes per kilometer), which is how runners usually track their speed. Speed is measured in distance per unit of time (e.g., miles per hour)." } },
        { "@type": "Question", name: "How can I use this calculator for my race?", acceptedAnswer: { "@type": "Answer", text: "You can enter your goal race time and the race distance to determine the exact pace you need to maintain throughout the race. This is crucial for pacing yourself correctly." } }
    ]
  },
];

const academicCalculators: Calculator[] = [
  {
    title: "Grade Calculator",
    href: "/calculators/grade",
    description: "Calculate your current weighted average grade in a course by entering your assignment scores and their corresponding weights.",
    icon: "ScrollText",
    keywords: ["grade calculator", "weighted grade calculator", "course grade calculator", "whats my grade", "assignment calculator", "syllabus calculator"],
    faq: [
        { "@type": "Question", name: "What is a weighted grade?", acceptedAnswer: { "@type": "Answer", text: "A weighted grade is a grading system where different assignments or exams are worth a different percentage of your final grade. For example, a final exam might be worth 30% of your grade, while all homework combined is only worth 10%." } },
        { "@type": "Question", name: "What if my weights don't add up to 100%?", acceptedAnswer: { "@type": "Answer", text: "If the total weight of your entered assignments is not 100%, this calculator will normalize the result based on the weights you provided. However, for an accurate final grade, it's best to enter all course components to sum to 100%." } },
        { "@type": "Question", name: "Can I use this to calculate my final course grade?", acceptedAnswer: { "@type": "Answer", text: "Yes, if you have scores for all components of your course (homework, midterms, final exam, etc.) and their weights add up to 100%, the result will be your final course grade." } }
    ]
  },
  {
    title: "GPA Calculator (4.0 Scale)",
    href: "/calculators/gpa",
    description: "Quickly compute your Grade Point Average (GPA) for a semester on a standard 4.0 scale. Perfect for US high school and college students.",
    icon: "GraduationCap",
    keywords: ["gpa calculator", "grade point average calculator", "college gpa calculator", "high school gpa", "calculate my gpa", "4.0 gpa scale"],
    faq: [
        { "@type": "Question", name: "How is GPA calculated on a 4.0 scale?", acceptedAnswer: { "@type": "Answer", text: "GPA is calculated by dividing the total number of grade points earned (e.g., A=4.0, B=3.0) by the total number of credit hours attempted. This calculator automates that process for you." } },
        { "@type": "Question", name: "What is the difference between weighted and unweighted GPA?", acceptedAnswer: { "@type": "Answer", text: "Unweighted GPA is on a 4.0 scale, as used here, where an A is always a 4.0. Weighted GPA gives extra points for advanced (AP, IB, Honors) courses, often using a 5.0 scale, where an A in an advanced class can be worth 5.0 points." } },
        { "@type": "Question", name: "Does 'A+' count as more than an 'A'?", acceptedAnswer: { "@type": "Answer", text: "It depends on the institution. Many universities cap the grade points for an A-range grade at 4.0, so both A and A+ are worth 4.0 points. Our calculator follows this common convention." } }
    ]
  },
  {
    title: "CGPA & SGPA Calculator",
    href: "/calculators/cgpa",
    description: "Calculate your Semester (SGPA) and Cumulative (CGPA) Grade Point Average with our advanced tool, using a 10-point grading scale.",
    icon: "BookOpenCheck",
    keywords: ["cgpa calculator", "sgpa calculator", "cumulative gpa", "semester gpa", "gpa from sgpa", "10 point gpa", "engineering gpa"],
    faq: [
        { "@type": "Question", name: "What is the difference between SGPA and CGPA?", acceptedAnswer: { "@type": "Answer", text: "SGPA (Semester Grade Point Average) is the grade point average for a single semester. CGPA (Cumulative Grade Point Average) is the average of the SGPA's from all previous semesters, weighted by the credits in each semester." } },
        { "@type": "Question", name: "How is CGPA calculated from SGPA?", acceptedAnswer: { "@type": "Answer", text: "To calculate CGPA, you multiply each semester's SGPA by the number of credits for that semester, sum these values, and then divide by the total number of credits earned across all semesters. Our calculator automates this for you." } },
        { "@type": "Question", name: "What grading scale does this calculator use?", acceptedAnswer: { "@type": "Answer", text: "This calculator uses a 10-point grading scale (O=10, A+=9, etc.), which is common in many engineering and technical universities, particularly in India. For a standard 4.0 scale, please use our separate GPA Calculator." } }
    ]
  },
  {
    title: "Final Grade Calculator",
    href: "/calculators/final-grade",
    description: "Determine the exact grade you need on your final exam to achieve your desired overall course grade. A must-have tool for every student.",
    icon: "GraduationCap",
    keywords: ["final grade calculator", "exam grade calculator", "what do i need on my final", "grade needed calculator", "finals calculator", "test score calculator"],
     faq: [
        { "@type": "Question", name: "How do I find out the weight of my final exam?", acceptedAnswer: { "@type": "Answer", text: "The weight of your final exam is usually listed in your course syllabus. It's often expressed as a percentage of your total course grade (e.g., 'Final Exam: 30%')." } },
        { "@type": "Question", name: "What does 'Current Grade' mean?", acceptedAnswer: { "@type": "Answer", text: "Your 'Current Grade' is your weighted average for all the work you have completed *so far*. This does not include the final exam. You can use our 'Grade Calculator' to find this value if you're unsure." } },
        { "@type": "Question", name: "What if it's mathematically impossible to get my desired grade?", acceptedAnswer: { "@type": "Answer", text: "If the calculator shows you need a score over 100% on the final, it means your desired grade is not mathematically achievable based on your current grade and the exam's weight. Conversely, if it shows a negative number, you've already achieved your goal grade." } }
    ]
  },
];

const mathCalculators: Calculator[] = [
    {
    title: "Standard Calculator",
    href: "/calculators/standard",
    description: "A simple, easy-to-use online calculator for all your basic arithmetic operations, including addition, subtraction, multiplication, and division.",
    icon: "Calculator",
    keywords: ["standard calculator", "basic calculator", "online calculator", "simple math", "arithmetic calculator", "add subtract multiply divide"],
    faq: [
        { "@type": "Question", name: "How does the percentage (%) button work?", acceptedAnswer: { "@type": "Answer", text: "The percent button converts the current number to its decimal equivalent (dividing by 100). If used in an operation like 100 + 10%, it calculates 10% of 100 (which is 10) and adds it, resulting in 110." } },
        { "@type": "Question", name: "Can I use this calculator for scientific calculations?", acceptedAnswer: { "@type": "Answer", text: "This is a basic calculator for simple arithmetic. For more complex operations like trigonometry, logarithms, or exponents, please use our advanced Scientific Calculator." } },
        { "@type": "Question", name: "How do I perform chained calculations?", acceptedAnswer: { "@type": "Answer", text: "You can chain calculations easily. For example, to calculate 5 + 3 * 2, you can press '5', '+', '3', '=', which gives 8, and then '*', '2', '=', which gives 16. For complex order of operations, use our Scientific Calculator." } }
    ]
  },
  {
    title: "Scientific Calculator",
    href: "/calculators/scientific",
    description: "An advanced online scientific calculator with a robust expression parser. It handles trigonometry, logarithms, exponents, and respects order of operations (PEMDAS).",
    icon: "FlaskConical",
    keywords: ["scientific calculator", "online scientific calculator", "advanced calculator", "pemdas calculator", "trigonometry calculator", "logarithm calculator", "exponent calculator"],
     faq: [
        { "@type": "Question", name: "What is PEMDAS/BODMAS?", acceptedAnswer: { "@type": "Answer", text: "PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction) is an acronym for the order of operations in mathematics. This calculator's advanced parser follows these rules to ensure accurate results for complex expressions." } },
        { "@type": "Question", name: "How do I use the trigonometric functions (sin, cos, tan)?", acceptedAnswer: { "@type": "Answer", text: "You can switch between Degrees (Deg) and Radians (Rad) mode using the toggle buttons. Then, enter the function followed by the angle in parentheses. For example: sin(30) in degree mode will yield 0.5." } },
        { "@type": "Question", name: "Does this calculator support implicit multiplication?", acceptedAnswer: { "@type": "Answer", text: "Yes. The calculator understands implicit multiplication, so you can enter expressions like '2(3+4)' or '5sin(30)' and it will correctly interpret them as '2 * (3+4)' and '5 * sin(30)'." } }
    ]
  },
  {
    title: "Percentage Calculator",
    href: "/calculators/percentage",
    description: "A versatile tool to perform various common percentage calculations, such as finding a percentage of a number, percentage change, and more.",
    icon: "Percent",
    keywords: ["percentage calculator", "percent calculator", "calculate percentage", "percentage change", "x is what percent of y", "percent increase decrease"],
     faq: [
        { "@type": "Question", name: "How do I calculate 'What is X% of Y'?", acceptedAnswer: { "@type": "Answer", text: "To calculate a percentage of a number, convert the percentage to a decimal by dividing it by 100, then multiply the decimal by the number. For example, 20% of 50 is 0.20 * 50 = 10." } },
        { "@type": "Question", name: "How do I calculate percentage increase or decrease?", acceptedAnswer: { "@type": "Answer", text: "To calculate the percentage change, subtract the old value from the new value, then divide that result by the old value. Finally, multiply by 100 to get the percentage. The formula is ((New Value - Old Value) / Old Value) * 100." } },
        { "@type": "Question", name: "How do I calculate 'X is what percent of Y'?", acceptedAnswer: { "@type": "Answer", text: "To find what percentage one number is of another, divide the 'part' (X) by the 'whole' (Y), and then multiply the result by 100. For example, to find what percent 10 is of 200, you calculate (10 / 200) * 100 = 5%." } }
    ]
  },
  {
    title: "Fraction Calculator",
    href: "/calculators/fraction",
    description: "Easily perform arithmetic with fractions. This calculator can add, subtract, multiply, and divide fractions, and it simplifies the results.",
    icon: "Sigma",
    keywords: ["fraction calculator", "add fractions", "subtract fractions", "multiply fractions", "divide fractions", "simplify fractions", "mixed numbers"],
    faq: [
        { "@type": "Question", name: "What is an improper fraction?", acceptedAnswer: { "@type": "Answer", text: "An improper fraction is one where the numerator (the top number) is greater than or equal to the denominator (the bottom number), such as 5/4. This calculator can work with both proper and improper fractions." } },
        { "@type": "Question", name: "How do you divide fractions?", acceptedAnswer: { "@type": "Answer", text: "To divide one fraction by another, you multiply the first fraction by the reciprocal (the flipped version) of the second fraction. For example, 1/2 ÷ 1/4 is the same as 1/2 × 4/1, which equals 2." } },
        { "@type": "Question", name: "Does this calculator simplify fractions?", acceptedAnswer: { "@type": "Answer", text: "Yes, all results are automatically simplified to their lowest terms. For example, if a calculation results in 2/4, the calculator will display the simplified result, 1/2." } }
    ]
  },
  {
    title: "Standard Deviation Calculator",
    href: "/calculators/standard-deviation",
    description: "Calculate the standard deviation, variance, mean, and other statistical measures for a set of numbers. Supports both sample and population data.",
    icon: "BarChart3",
    keywords: ["standard deviation calculator", "statistics calculator", "variance calculator", "mean calculator", "sample vs population", "data set analysis"],
    faq: [
        { "@type": "Question", name: "What is standard deviation?", acceptedAnswer: { "@type": "Answer", text: "Standard deviation is a measure of the amount of variation or dispersion of a set of values. A low standard deviation indicates that the values tend to be close to the mean (average), while a high standard deviation indicates that the values are spread out over a wider range." } },
        { "@type": "Question", name: "What is the difference between sample and population standard deviation?", acceptedAnswer: { "@type": "Answer", text: "You use the population formula when your data includes every member of a group. You use the sample formula when your data is a random subset of a larger population. The sample formula uses 'n-1' in the denominator to provide an unbiased estimate of the population's deviation, which is the standard statistical practice." } },
        { "@type": "Question", name: "What is variance?", acceptedAnswer: { "@type": "Answer", text: "Variance is another measure of how spread out a data set is. It is the average of the squared differences from the Mean. The standard deviation is simply the square root of the variance, which brings the unit of measure back to the original unit of the data." } }
    ]
  },
  {
    title: "Graphing Calculator",
    href: "/calculators/graphing",
    description: "Visualize mathematical functions and equations with this powerful graphing calculator. Plot multiple equations and explore their relationships.",
    icon: "LineChart",
    keywords: ["graphing calculator", "online graphing tool", "plot function", "equation grapher", "math visualizer", "function plotter", "cartesian coordinates"],
    faq: [
        { "@type": "Question", name: "What types of functions can I graph?", acceptedAnswer: { "@type": "Answer", text: "Our graphing calculator supports a wide range of functions, including linear (e.g., 2x + 3), polynomial (e.g., x^3 - 6x^2 + 11x - 6), trigonometric (e.g., sin(x), cos(x)), and exponential (e.g., 2^x) equations." } },
        { "@type": "Question", name: "Can I find the intersection points?", acceptedAnswer: { "@type": "Answer", text: "While the graph visually shows intersection points, the calculator does not currently compute their exact coordinates automatically. You can visually estimate the intersections by examining where the lines cross on the plot." } },
        { "@type": "Question", name: "How do I zoom or pan the graph?", acceptedAnswer: { "@type": "Answer", text: "You can zoom in and out of the graph using the scroll wheel on your mouse or by using pinch-to-zoom gestures on a touch device. To pan the graph, simply click and drag." } }
    ]
  },
];

const generalCalculators: Calculator[] = [
  {
    title: "Age Calculator",
    href: "/calculators/age",
    description: "Calculate your age in years, months, and days based on your date of birth. See fun facts like how many days you've been alive.",
    icon: "CalendarDays",
    keywords: ["age calculator", "how old am i", "birthday calculator", "date of birth calculator", "chronological age", "date difference"],
    faq: [
        { "@type": "Question", name: "How is the age calculated?", acceptedAnswer: { "@type": "Answer", text: "The age is calculated by finding the precise difference between your date of birth and the current date (or a date you specify), accounting for leap years to ensure accuracy." } },
        { "@type": "Question", name: "Can I find my age on a future date?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can input a future date in the 'Age at Date of' field to see how old you will be on that specific day." } },
        { "@type": "Question", name: "Why does the result show age in so many different units?", acceptedAnswer: { "@type": "Answer", text: "We provide the result in multiple units (total months, days, hours, etc.) as a fun way to perceive your age differently. It highlights just how long you've been alive in various measures of time." } }
    ]
  },
  {
    title: "Time Calculator",
    href: "/calculators/time",
    description: "Add or subtract time durations with ease. This calculator handles hours, minutes, and seconds, including decimal values for precise results.",
    icon: "Clock",
    keywords: ["time calculator", "duration calculator", "add time", "subtract time", "hours and minutes calculator", "time duration"],
    faq: [
        { "@type": "Question", name: "Can I enter decimal values?", acceptedAnswer: { "@type": "Answer", text: "Yes, this calculator supports decimal values for hours, minutes, and seconds, allowing for more precise time calculations. For example, you can enter 1.5 hours instead of 1 hour and 30 minutes." } },
        { "@type": "Question", name: "How does the calculator handle negative results?", acceptedAnswer: { "@type": "Answer", text: "If you subtract a larger time value from a smaller one, the calculator will display a negative result, indicated by a minus sign, to accurately reflect the time difference." } },
        { "@type": "Question", name: "What format is the result displayed in?", acceptedAnswer: { "@type": "Answer", text: "The result is displayed in HH:MM:SS.ss format, which stands for Hours, Minutes, Seconds, and hundredths of a second, providing a clear and standardized output." } }
    ]
  },
];

export const calculatorGroups: CalculatorGroup[] = [
  {
    id: "financial",
    name: "Financial",
    description: "Tools to manage your finances, from loans and mortgages to investments and inflation.",
    calculators: financialCalculators,
  },
  {
    id: "health",
    name: "Health & Fitness",
    description: "Calculators to help you track your health and fitness goals, from BMI to calorie intake.",
    calculators: healthCalculators,
  },
  {
    id: "academic",
    name: "Academic",
    description: "Essential tools for students to calculate grades, GPA, and plan for academic success.",
    calculators: academicCalculators,
  },
  {
    id: "math",
    name: "Math",
    description: "A suite of powerful mathematical tools, from basic arithmetic to advanced graphing and statistics.",
    calculators: mathCalculators,
  },
  {
    id: "general",
    name: "General Tools",
    description: "A collection of useful calculators for everyday time and date calculations.",
    calculators: generalCalculators,
  }
];

export const allCalculators: Calculator[] = [
  ...financialCalculators,
  ...healthCalculators,
  ...academicCalculators,
  ...mathCalculators,
  ...generalCalculators,
].sort((a, b) => a.title.localeCompare(b.title));
