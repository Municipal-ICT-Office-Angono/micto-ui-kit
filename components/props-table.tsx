"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PropItem {
  name: string;
  type: string;
  default: string;
  description: string;
}

export function PropsTable({ data }: { data: PropItem[] }) {
  return (
    <div className="rounded-xl border overflow-hidden shadow-sm bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[200px] font-bold text-foreground/80 lowercase tracking-tight">Prop</TableHead>
            <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">Type</TableHead>
            <TableHead className="w-[100px] font-bold text-foreground/80 lowercase tracking-tight">Default</TableHead>
            <TableHead className="text-right font-bold text-foreground/80 lowercase tracking-tight">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((prop) => (
            <TableRow key={prop.name} className="border-b transition-colors hover:bg-muted/5 font-sans">
              <TableCell className="font-mono text-xs font-semibold text-primary/80">{prop.name}</TableCell>
              <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400 whitespace-pre-wrap">{prop.type}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground/70">{prop.default}</TableCell>
              <TableCell className="text-right text-xs leading-relaxed max-w-[280px] text-muted-foreground">{prop.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
