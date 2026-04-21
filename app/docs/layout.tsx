import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsPager } from "@/components/docs-pager";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
      <DocsSidebar />
      <main className="py-10 px-6 md:px-10 lg:px-20 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-4xl">
          {children}
          <DocsPager />
        </div>
      </main>
    </div>
  );
}
