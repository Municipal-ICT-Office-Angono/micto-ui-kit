import Link from "next/link";
import { Command } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-12 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 mx-auto px-6">
        <p className="text-balance text-center text-[11px] leading-loose text-muted-foreground">
          Maintained by{" "}
          <span className="font-semibold text-foreground">MICTO | Angono</span>.
          The source code is available on{" "}
          <Link
            href="https://github.com/Municipal-ICT-Office-Angono/micto-ui-kit"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          . Components based on{" "}
          <Link
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            shadcn/ui
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
