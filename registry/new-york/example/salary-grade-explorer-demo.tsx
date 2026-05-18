"use client";

import * as React from "react";
import { SalaryGradeExplorer, SalaryBreakdownItem } from "@/components/micto/salary-grade-explorer";

// Default additions/deductions to mock lists
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

export default function SalaryGradeExplorerDemo() {
  const [grade, setGrade] = React.useState(11);
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [checkedAdditions, setCheckedAdditions] = React.useState<string[]>([]);
  const [checkedDeductions, setCheckedDeductions] = React.useState<string[]>([]);

  // Local simulated payroll result
  const [payrollResult, setPayrollResult] = React.useState<{
    basicSalary: number;
    allowances: SalaryBreakdownItem[];
    deductions: SalaryBreakdownItem[];
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
  } | undefined>(undefined);

  // Simulated API handler performing standard backend-driven calculations
  const calculatePayrollOnBackend = React.useCallback(
    (g: number, s: number, additions: string[], deductions: string[]) => {
      setIsLoading(true);

      // Simulate a network latency delay of 450ms
      setTimeout(() => {
        // Calculate basic salary based on standardized SSL formula
        const baseSalary = Math.round(13000 * Math.pow(1.075, g - 1));
        const basic = Math.round(baseSalary * Math.pow(1.015, s - 1));

        // Assemble active additions
        const activeAdditions = defaultAdditionsList.filter((a) => additions.includes(a.id));
        const allowances: SalaryBreakdownItem[] = [
          {
            label: "PERA (Personnel Economic Relief Allowance)",
            amount: 2000,
            category: "allowance",
          },
        ];
        activeAdditions.forEach((add) => {
          allowances.push({ label: add.label, amount: add.defaultAmount, category: "allowance" });
        });

        const totalAllowances = allowances.reduce((sum, item) => sum + item.amount, 0);
        const grossSalary = basic + totalAllowances;

        // Assemble statutory & voluntary deductions
        const deductionItems: SalaryBreakdownItem[] = [];

        // 1. GSIS Personal Share (9% of Basic)
        const gsis = Math.round(basic * 0.09);
        deductionItems.push({
          label: "GSIS Retirement Contribution (9%)",
          amount: gsis,
          category: "statutory",
        });

        // 2. PhilHealth Share (2.5% capped at 10,000 monthly base = 250)
        const phBase = Math.min(basic, 10000);
        const philhealth = Math.round(phBase * 0.025);
        deductionItems.push({
          label: "PhilHealth Insurance Contribution",
          amount: philhealth,
          category: "statutory",
        });

        // 3. Pag-IBIG flat contribution
        deductionItems.push({
          label: "Pag-IBIG Contribution",
          amount: 100,
          category: "statutory",
        });

        // 4. BIR tax calculation
        const taxableIncome = basic - gsis - philhealth - 100;
        const birTax = taxableIncome > 20833 ? Math.round((taxableIncome - 20833) * 0.15) : 0;
        if (birTax > 0) {
          deductionItems.push({
            label: "BIR Withholding Tax (Standard Bracket)",
            amount: birTax,
            category: "tax",
          });
        }

        // 5. Voluntary deductions
        const activeDeductions = defaultDeductionsList.filter((d) => deductions.includes(d.id));
        activeDeductions.forEach((ded) => {
          deductionItems.push({
            label: ded.label,
            amount: ded.defaultAmount,
            category: "voluntary",
          });
        });

        const totalDeductions = deductionItems.reduce((sum, item) => sum + item.amount, 0);
        const netSalary = grossSalary - totalDeductions;

        // Update single source of truth results state
        setPayrollResult({
          basicSalary: basic,
          allowances,
          deductions: deductionItems,
          grossSalary,
          totalDeductions,
          netSalary,
        });

        setIsLoading(false);
      }, 450);
    },
    [],
  );

  // Initialize initial calculation
  React.useEffect(() => {
    calculatePayrollOnBackend(grade, step, checkedAdditions, checkedDeductions);
  }, [grade, step, checkedAdditions, checkedDeductions, calculatePayrollOnBackend]);

  // Handle selection pipeline updates
  const handleSelectionChange = (
    g: number,
    s: number,
    additions: string[],
    deductions: string[],
  ) => {
    setGrade(g);
    setStep(s);
    setCheckedAdditions(additions);
    setCheckedDeductions(deductions);
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-8 bg-muted/20 border rounded-xl max-w-full">
      <SalaryGradeExplorer
        employeeId="2026-8802"
        employeeName="Nehry Dedoro"
        department="Municipal Information and Communications Technology Office (MICTO)"
        position="Lead Systems Developer"
        activeGrade={grade}
        activeStep={step}
        payrollResult={payrollResult}
        onSelectionChange={handleSelectionChange}
        isLoading={isLoading}
        className="max-w-6xl w-full"
      />
    </div>
  );
}
