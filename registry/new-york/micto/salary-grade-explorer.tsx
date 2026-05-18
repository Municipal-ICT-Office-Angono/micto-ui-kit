/**
 * @title Salary Grade Explorer
 * @description A highly-detailed government salary grade matrix browser, payroll contribution simulator, and visual pay slip previewer.
 * @categories react, component, micto
 */
"use client";

import * as React from "react";
import {
  Search,
  Download,
  Coins,
  ShieldAlert,
  Loader2,
  Building2,
  User,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface SalaryBreakdownItem {
  label: string;
  amount: number;
  category: "basic" | "allowance" | "statutory" | "tax" | "voluntary";
}

export interface SalaryGradeStepData {
  grade: number;
  step: number;
  basicSalary: number;
}

export interface SalaryGradeExplorerProps extends React.HTMLAttributes<HTMLDivElement> {
  employeeId?: string;
  employeeName?: string;
  department?: string;
  position?: string;

  // Grade & Step scale configurations
  salaryGrades?: SalaryGradeStepData[];
  activeGrade?: number;
  activeStep?: number;

  // Lists of optional/voluntary components available in the simulator
  availableAdditions?: Array<{ id: string; label: string; defaultAmount: number }>;
  availableDeductions?: Array<{ id: string; label: string; defaultAmount: number }>;

  // Calculated payroll outcome supplied from the backend/parent
  payrollResult?: {
    basicSalary: number;
    allowances: SalaryBreakdownItem[];
    deductions: SalaryBreakdownItem[];
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
  };

  // State callbacks
  onSelectionChange?: (
    grade: number,
    step: number,
    selectedAdditions: string[],
    selectedDeductions: string[],
  ) => void;

  isLoading?: boolean;
}

// ─── Default Static Local Fallbacks ──────────────────────────────────────────

// Realistic base LGU Salary Standardization Law matrix (grades 1 to 24)
const defaultSalaryScale: SalaryGradeStepData[] = [];
for (let g = 1; g <= 24; g++) {
  // Base scale starts at ₱13,000 for SG 1 and scales by ~7.5% per grade
  const baseSalary = Math.round(13000 * Math.pow(1.075, g - 1));
  for (let s = 1; s <= 8; s++) {
    // 1.5% step increment
    const stepSalary = Math.round(baseSalary * Math.pow(1.015, s - 1));
    defaultSalaryScale.push({
      grade: g,
      step: s,
      basicSalary: stepSalary,
    });
  }
}

const defaultAdditionsList = [
  { id: "overtime", label: "Overtime (Standard Block)", defaultAmount: 3500 },
  { id: "hazard", label: "Hazard Pay (LGU High Risk)", defaultAmount: 2000 },
  { id: "subsistence", label: "Subsistence & Laundry Allowance", defaultAmount: 1500 },
];

const defaultDeductionsList = [
  { id: "coop_loan", label: "LGU Employees Cooperative Loan", defaultAmount: 2500 },
  { id: "provident", label: "Provident Fund Contribution", defaultAmount: 1000 },
  { id: "union", label: "LGU Employees Union Dues", defaultAmount: 200 },
];

// Fallback math calculation simulating standard government deductions
const calculateLocalPayroll = (
  basic: number,
  additions: string[],
  deductions: string[],
) => {
  const activeAdditions = defaultAdditionsList.filter((a) => additions.includes(a.id));
  const activeDeductions = defaultDeductionsList.filter((d) => deductions.includes(d.id));

  // Gross Earnings
  const allowances: SalaryBreakdownItem[] = [
    { label: "PERA (Personnel Economic Relief Allowance)", amount: 2000, category: "allowance" },
  ];
  activeAdditions.forEach((add) => {
    allowances.push({ label: add.label, amount: add.defaultAmount, category: "allowance" });
  });

  const totalAllowances = allowances.reduce((sum, item) => sum + item.amount, 0);
  const grossSalary = basic + totalAllowances;

  // Deductions
  const deductionItems: SalaryBreakdownItem[] = [];

  // 1. GSIS Personal Share (9% of Basic)
  const gsis = Math.round(basic * 0.09);
  deductionItems.push({ label: "GSIS Life & Retirement Insurance (9%)", amount: gsis, category: "statutory" });

  // 2. PhilHealth Personal Share (2.5% of Basic, capped at 10,000 monthly base = 250)
  const phBase = Math.min(basic, 10000);
  const philhealth = Math.round(phBase * 0.025);
  deductionItems.push({ label: "PhilHealth Health Insurance", amount: philhealth, category: "statutory" });

  // 3. Pag-IBIG HDMF Contribution (flat 100)
  deductionItems.push({ label: "Pag-IBIG HDMF Contribution", amount: 100, category: "statutory" });

  // 4. BIR Tax (simplified monthly bracket: 15% of basic exceeding ₱20,833)
  const taxableIncome = basic - gsis - philhealth - 100;
  const birTax = taxableIncome > 20833 ? Math.round((taxableIncome - 20833) * 0.15) : 0;
  if (birTax > 0) {
    deductionItems.push({ label: "BIR Withholding Tax", amount: birTax, category: "tax" });
  }

  // 5. Voluntary deductions checked in simulator
  activeDeductions.forEach((ded) => {
    deductionItems.push({ label: ded.label, amount: ded.defaultAmount, category: "voluntary" });
  });

  const totalDeductions = deductionItems.reduce((sum, item) => sum + item.amount, 0);
  const netSalary = grossSalary - totalDeductions;

  return {
    basicSalary: basic,
    allowances,
    deductions: deductionItems,
    grossSalary,
    totalDeductions,
    netSalary,
  };
};

export const SalaryGradeExplorer = React.forwardRef<
  HTMLDivElement,
  SalaryGradeExplorerProps
>(
  (
    {
      employeeId = "EMP-2026-0812",
      employeeName = "Nehry Dedoro",
      department = "Municipal Information and Communications Technology Office (MICTO)",
      position = "Lead Systems Developer",
      salaryGrades = defaultSalaryScale,
      activeGrade = 11,
      activeStep = 1,
      availableAdditions = defaultAdditionsList,
      availableDeductions = defaultDeductionsList,
      payrollResult,
      onSelectionChange,
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    // Selection state variables
    const [selectedGrade, setSelectedGrade] = React.useState<number>(activeGrade);
    const [selectedStep, setSelectedStep] = React.useState<number>(activeStep);
    const [checkedAdditions, setCheckedAdditions] = React.useState<string[]>([]);
    const [checkedDeductions, setCheckedDeductions] = React.useState<string[]>([]);
    const [searchQuery, setSearchQuery] = React.useState("");

    // Maintain dynamic states when props change
    React.useEffect(() => {
      setSelectedGrade(activeGrade);
    }, [activeGrade]);

    React.useEffect(() => {
      setSelectedStep(activeStep);
    }, [activeStep]);

    // Handle updates and trigger parent callback
    const handleGradeStepChange = (grade: number, step: number) => {
      setSelectedGrade(grade);
      setSelectedStep(step);
      if (onSelectionChange) {
        onSelectionChange(grade, step, checkedAdditions, checkedDeductions);
      }
    };

    const handleAdditionToggle = (id: string, checked: boolean) => {
      const updated = checked
        ? [...checkedAdditions, id]
        : checkedAdditions.filter((x) => x !== id);
      setCheckedAdditions(updated);
      if (onSelectionChange) {
        onSelectionChange(selectedGrade, selectedStep, updated, checkedDeductions);
      }
    };

    const handleDeductionToggle = (id: string, checked: boolean) => {
      const updated = checked
        ? [...checkedDeductions, id]
        : checkedDeductions.filter((x) => x !== id);
      setCheckedDeductions(updated);
      if (onSelectionChange) {
        onSelectionChange(selectedGrade, selectedStep, checkedAdditions, updated);
      }
    };

    // Calculate details (either supplied by parent/backend, or processed locally as a preview fallback)
    const activeSalaryGradeItem = salaryGrades.find(
      (s) => s.grade === selectedGrade && s.step === selectedStep,
    );
    const baseSalary = activeSalaryGradeItem ? activeSalaryGradeItem.basicSalary : 0;

    const result = payrollResult
      ? payrollResult
      : calculateLocalPayroll(baseSalary, checkedAdditions, checkedDeductions);

    // Compute Take-home ratios
    const netPercent = result.grossSalary > 0
      ? Math.round((result.netSalary / result.grossSalary) * 100)
      : 0;

    // Filter salary grades table
    const uniqueGrades = React.useMemo(() => {
      const grades = new Set<number>();
      salaryGrades.forEach((s) => grades.add(s.grade));
      return Array.from(grades).sort((a, b) => a - b);
    }, [salaryGrades]);

    const filteredGrades = React.useMemo(() => {
      if (!searchQuery) return uniqueGrades;
      const query = searchQuery.trim();
      return uniqueGrades.filter((g) => g.toString().includes(query));
    }, [uniqueGrades, searchQuery]);

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-foreground", className)}
        {...props}
      >
        {/* LEFT COLUMN: Explorer & Matrix Browser */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="rounded-xl border bg-card shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>LGU Salary Standard Scale</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Browse active Salary Standardization Law grade steps and basic wages.
                  </p>
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input
                    placeholder="Search Grade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-xs h-8.5 rounded-lg border-input/60 w-full"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 border-t">
              <div className="max-h-[360px] overflow-y-auto min-w-full">
                <Table className="relative">
                  <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-xs z-10 border-b">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-2.5 px-4 text-xs font-semibold text-left w-20">Grade</TableHead>
                      <TableHead className="py-2.5 px-4 text-xs font-semibold text-center w-24">Base (Step 1)</TableHead>
                      <TableHead className="py-2.5 px-4 text-xs font-semibold text-center w-24">Max (Step 8)</TableHead>
                      <TableHead className="py-2.5 px-4 text-xs font-semibold text-right">Step Selector</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g) => {
                      const step1 = salaryGrades.find((s) => s.grade === g && s.step === 1);
                      const step8 = salaryGrades.find((s) => s.grade === g && s.step === 8);
                      const isSelectedGrade = selectedGrade === g;

                      return (
                        <TableRow
                          key={g}
                          className={cn(
                            "group/row hover:bg-muted/30 transition-colors border-b last:border-0",
                            isSelectedGrade && "bg-primary/5 hover:bg-primary/5 font-semibold",
                          )}
                        >
                          <TableCell className="py-2.5 px-4 font-mono font-medium text-left">
                            <span className={cn("text-xs font-bold", isSelectedGrade ? "text-primary" : "text-foreground")}>
                              SG {String(g).padStart(2, "0")}
                            </span>
                          </TableCell>
                          <TableCell className="py-2.5 px-4 font-mono text-center text-xs">
                            ₱{step1 ? step1.basicSalary.toLocaleString() : "-"}
                          </TableCell>
                          <TableCell className="py-2.5 px-4 font-mono text-center text-xs">
                            ₱{step8 ? step8.basicSalary.toLocaleString() : "-"}
                          </TableCell>
                          <TableCell className="py-1 px-4 text-right">
                            <div className="flex items-center justify-end gap-1 flex-wrap max-w-full">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
                                const activeStepItem = salaryGrades.find(
                                  (item) => item.grade === g && item.step === s,
                                );
                                const isCurrent = selectedGrade === g && selectedStep === s;

                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleGradeStepChange(g, s)}
                                    className={cn(
                                      "h-6 w-6 font-mono text-[9px] rounded-md border flex items-center justify-center transition-all focus:outline-hidden",
                                      isCurrent
                                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs scale-105"
                                        : activeStepItem
                                        ? "bg-background text-muted-foreground border-input/60 hover:border-primary/50 hover:text-primary"
                                        : "opacity-20 cursor-not-allowed",
                                    )}
                                    title={
                                      activeStepItem
                                        ? `SG ${g} Step ${s}: ₱${activeStepItem.basicSalary.toLocaleString()}`
                                        : `Step ${s} unavailable`
                                    }
                                    disabled={!activeStepItem}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredGrades.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-xs text-muted-foreground">
                          No matching salary grades found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* DYNAMIC SIMULATOR CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Simulation Additions */}
            <Card className="rounded-xl border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Interactive Additions</span>
                </h4>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                {availableAdditions.map((item) => {
                  const isChecked = checkedAdditions.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 p-2.5 rounded-lg border transition-all",
                        isChecked
                          ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                          : "bg-background/50 border-input/40 text-muted-foreground",
                      )}
                    >
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleAdditionToggle(item.id, !!checked)}
                        className="mt-0.5 border-input data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={item.id} className="text-xs font-semibold cursor-pointer block text-foreground truncate">
                          {item.label}
                        </Label>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                          +₱{item.defaultAmount.toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Simulation Deductions */}
            <Card className="rounded-xl border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                  <span>Voluntary Deductions</span>
                </h4>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                {availableDeductions.map((item) => {
                  const isChecked = checkedDeductions.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 p-2.5 rounded-lg border transition-all",
                        isChecked
                          ? "bg-rose-500/5 border-rose-500/20 text-foreground"
                          : "bg-background/50 border-input/40 text-muted-foreground",
                      )}
                    >
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleDeductionToggle(item.id, !!checked)}
                        className="mt-0.5 border-input data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={item.id} className="text-xs font-semibold cursor-pointer block text-foreground truncate">
                          {item.label}
                        </Label>
                        <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold block mt-0.5">
                          -₱{item.defaultAmount.toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: Government Payslip rendering */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="rounded-xl border bg-card shadow-xs overflow-hidden relative flex flex-col h-full min-h-[500px]">
            {/* Async Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col justify-center items-center gap-3 z-50 transition-opacity">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Auditing scale calculations...
                </span>
              </div>
            )}

            {/* Payslip Header Info */}
            <CardHeader className="p-5 pb-4 bg-muted/20 border-b flex flex-col gap-4">
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-1.5 py-0.5 border-primary/20 bg-primary/5 text-primary font-bold text-[9px] uppercase tracking-wider">
                    LGU HRIS System
                  </div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mt-1">
                    Payroll Itemized Statement
                  </h3>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-input/60 hover:bg-muted"
                  title="Export Payslip"
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Employee metadata */}
              <div className="space-y-2 border-t pt-3 border-input/40">
                <div className="flex items-center gap-2 text-xs">
                  <User className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="font-semibold text-foreground">{employeeName}</span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground font-mono text-[10px]">ID: {employeeId}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <div className="leading-tight text-muted-foreground">
                    <span className="font-medium text-foreground/80 block">{position}</span>
                    <span className="text-[10px] mt-0.5 block">{department}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Itemized List Panel */}
            <CardContent className="p-5 flex-1 flex flex-col justify-between gap-6 min-h-0">
              <div className="space-y-4">
                {/* Earnings List */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                    Gross Earnings
                  </h4>
                  <div className="space-y-1.5">
                    {/* Basic salary */}
                    <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 font-mono">
                      <span className="text-foreground font-sans font-semibold">Basic Standard Wage</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        ₱{result.basicSalary.toLocaleString()}.00
                      </span>
                    </div>
                    {/* Allowances list */}
                    {result.allowances.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pl-2 pr-2 py-0.5">
                        <span className="text-muted-foreground truncate max-w-[240px]">{item.label}</span>
                        <span className="font-mono text-foreground font-semibold">
                          ₱{item.amount.toLocaleString()}.00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions List */}
                <div className="space-y-2 border-t pt-3 border-input/40">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
                    Government & Simulation Deductions
                  </h4>
                  <div className="space-y-1.5">
                    {result.deductions.map((item, idx) => {
                      const isTax = item.category === "tax";
                      const isVoluntary = item.category === "voluntary";
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs pl-2 pr-2 py-0.5">
                          <span className="text-muted-foreground truncate max-w-[240px] flex items-center gap-1.5">
                            {isTax && <Badge variant="outline" className="text-[7.5px] px-1 py-0 border-rose-500/20 bg-rose-500/5 text-rose-500 font-bold uppercase rounded-sm">Tax</Badge>}
                            {isVoluntary && <Badge variant="outline" className="text-[7.5px] px-1 py-0 border-orange-500/20 bg-orange-500/5 text-orange-500 font-bold uppercase rounded-sm">Loan</Badge>}
                            <span className="truncate">{item.label}</span>
                          </span>
                          <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                            -₱{item.amount.toLocaleString()}.00
                          </span>
                        </div>
                      );
                    })}

                    {result.deductions.length === 0 && (
                      <div className="text-xs text-muted-foreground italic pl-2">
                        No active statutory or voluntary deductions.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payslip Foot Summary Card */}
              <div className="space-y-4 pt-4 border-t border-input/60 mt-6 shrink-0">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-muted/40 p-2.5 rounded-lg space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Gross Earnings</span>
                    <span className="font-mono font-bold text-foreground block">
                      ₱{result.grossSalary.toLocaleString()}.00
                    </span>
                  </div>

                  <div className="bg-muted/40 p-2.5 rounded-lg space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Total Deductions</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 block">
                      ₱{result.totalDeductions.toLocaleString()}.00
                    </span>
                  </div>
                </div>

                {/* Net Income Display panel */}
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                      Net Take-Home Wage
                    </span>
                    <div className="text-lg font-mono font-bold text-primary mt-0.5">
                      ₱{result.netSalary.toLocaleString()}.00
                    </div>
                  </div>

                  {/* Circular visual progress representation */}
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0">
                      {/* SVG circle meter */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          className="stroke-muted"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          className="stroke-primary"
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 16}
                          strokeDashoffset={2 * Math.PI * 16 * (1 - netPercent / 100)}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-primary">
                        {netPercent}%
                      </span>
                    </div>

                    <div className="leading-tight text-[10px] text-muted-foreground max-w-[80px]">
                      Net ratio of overall gross income.
                    </div>
                  </div>
                </div>

                {/* Active SG Info Box */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 p-2.5 rounded-lg flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-yellow-800 dark:text-yellow-400 leading-normal">
                    This payroll preview maps <strong>SG {selectedGrade} Step {selectedStep}</strong> dynamically. Always cross-reference with official LGU accounting audits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
);

SalaryGradeExplorer.displayName = "SalaryGradeExplorer";
