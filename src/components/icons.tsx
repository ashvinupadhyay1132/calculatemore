import type { SVGProps } from "react";
import {
  Landmark,
  HeartPulse,
  GraduationCap,
  Calculator,
  AreaChart,
  Coins,
  Percent,
  FlaskConical,
  Car,
  Flame,
  LineChart,
  Wallet,
  Sigma,
  Bike,
  TrendingUp,
  Clock,
  ScrollText,
  ArrowRightLeft,
  Users,
  PersonStanding,
  CalendarDays,
  Home,
  PiggyBank,
  Rabbit,
  BarChart3,
  Timer,
  ArrowUp,
  BookOpenCheck,
} from "lucide-react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H9"/>
    </svg>
  ),
  Landmark,
  HeartPulse,
  GraduationCap,
  Calculator,
  AreaChart,
  Coins,
  Percent,
  FlaskConical,
  Car,
  Flame,
  LineChart,
  Wallet,
  Sigma,
  Bike,
  TrendingUp,
  Clock,
  ScrollText,
  ArrowRightLeft,
  Users,
  PersonStanding,
  CalendarDays,
  Home,
  PiggyBank,
  Rabbit,
  BarChart3,
  Timer,
  ArrowUp,
  BookOpenCheck,
};

export type IconName = keyof typeof Icons;
