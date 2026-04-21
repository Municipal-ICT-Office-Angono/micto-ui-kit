import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DocsHeaderProps {
  title: string;
  description?: string;
  category?: string;
  badges?: React.ReactNode;
  className?: string;
}

export function DocsHeader({
  title,
  description,
  category = "Components",
  badges,
  className,
}: DocsHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{category}</span>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">{title}</span>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl text-foreground font-heading">
            {title}
          </h1>
          {description && (
            <p className="text-md text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {badges && (
          <div className="flex gap-2 shrink-0 items-center">{badges}</div>
        )}
      </div>
      <Separator className="my-4" />
    </div>
  );
}
