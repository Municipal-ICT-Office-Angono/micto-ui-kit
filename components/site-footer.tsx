import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="py-12 md:px-8 border-t bg-muted/10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-6">
        <p className="text-balance text-center md:text-left text-[11px] leading-loose text-muted-foreground">
          Developed and maintained by{" "}
          <Link
            href="https://nehrydedoro.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-foreground hover:underline hover:underline-offset-4 transition-all"
          >
            Nehry Dedoro
          </Link>{" "}
          for{" "}
          <span className="font-semibold text-foreground">MICTO | Angono</span>.
        </p>
        <p className="text-balance text-center md:text-right text-[11px] leading-loose text-muted-foreground">
          The source code is available on{" "}
          <Link
            href="https://github.com/Municipal-ICT-Office-Angono/micto-ui-kit"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
          . Components based on{" "}
          <Link
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            shadcn/ui
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
