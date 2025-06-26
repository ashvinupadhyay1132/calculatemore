
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { allCalculators, calculatorGroups } from "@/config/calculators";
import { Icons, type IconName } from "@/components/icons";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentCalculator = allCalculators.find(
    (calc) => calc.href === pathname
  );
  const pageTitle = currentCalculator?.title ?? "Calculators";

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold text-foreground">
              CalculateMore
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {calculatorGroups.map((group) => (
              <SidebarGroup key={group.id}>
                <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                {group.calculators.map((item) => {
                  const Icon = Icons[item.icon as IconName];
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={{
                          children: item.title,
                          side: "right",
                          align: "center",
                        }}
                      >
                        <Link href={item.href}>
                          {Icon && <Icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarGroup>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-20 items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold tracking-tight">
              {pageTitle}
            </h1>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
