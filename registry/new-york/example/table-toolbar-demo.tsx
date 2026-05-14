"use client";

import * as React from "react";
import { TableToolbar, ToolbarAction } from "@/components/ui/table-toolbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Archive,
  Download,
  Search,
  Eye,
  Settings2,
} from "lucide-react";

// --- Mock Data ---

const mockCitizens = [
  { id: "1", name: "Nehry Dedoro", role: "Lead Architect", municipality: "Angono", status: "active" },
  { id: "2", name: "Reyna Garcia", role: "Database Manager", municipality: "Taytay", status: "active" },
  { id: "3", name: "Mark Alvarez", role: "System Administrator", municipality: "Binangonan", status: "pending" },
  { id: "4", name: "Clara Bautista", role: "Support Officer", municipality: "Angono", status: "active" },
];

export default function TableToolbarDemo() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewVariant, setViewVariant] = React.useState<"inline" | "floating">("inline");

  // Filtering list based on search bar
  const filteredCitizens = React.useMemo(() => {
    return mockCitizens.filter(
      (citizen) =>
        citizen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        citizen.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleRowToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCitizens.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    alert(`Bulk Delete executed!\nTarget IDs: ${selectedIds.join(", ")}`);
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    alert(`Bulk Archive executed!\nTarget IDs: ${selectedIds.join(", ")}`);
    setSelectedIds([]);
  };

  const allSelected =
    filteredCitizens.length > 0 && selectedIds.length === filteredCitizens.length;

  return (
    <div className="w-full max-w-3xl mx-auto py-2 space-y-6">
      
      {/* Dynamic Selector to Switch Layout Styles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-card/65 p-4 shadow-xs">
        <div className="leading-tight space-y-1 text-center sm:text-left">
          <h5 className="text-xs font-semibold text-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Settings2 className="h-3.5 w-3.5 text-primary" />
            Toolbar Presentation Settings
          </h5>
          <p className="text-[10px] text-muted-foreground">
            Switch variants to compare Inline Morphing vs. Bottom Floating Dock systems.
          </p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-lg border text-xs gap-1 font-medium select-none">
          <button
            onClick={() => {
              setViewVariant("inline");
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewVariant === "inline"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Inline Morph
          </button>
          <button
            onClick={() => {
              setViewVariant("floating");
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewVariant === "floating"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Floating Dock
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-xs">
        
        {/* THE TABLE TOOLBAR WORKSPACE */}
        <TableToolbar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          variant={viewVariant}
          
          /* Left Filters (Active when selectedCount === 0) */
          children={
            <div className="flex items-center gap-2 w-full max-w-xs relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs rounded-lg focus-visible:ring-1"
              />
            </div>
          }
          
          /* Standard Right Actions (Active when selectedCount === 0) */
          actions={
            <>
              <ToolbarAction icon={Download}>Export</ToolbarAction>
              <ToolbarAction icon={Plus} variant="default">Add Member</ToolbarAction>
            </>
          }
          
          /* Bulk Operations (Active when selectedCount > 0) */
          bulkActions={
            <>
              <ToolbarAction icon={Archive} onClick={handleBulkArchive}>
                Archive
              </ToolbarAction>
              <ToolbarAction
                icon={Trash2}
                variant="destructive"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </ToolbarAction>
            </>
          }
        />

        {/* WORKSPACE DATA ROW TABLE */}
        <div className="rounded-xl border overflow-hidden mt-4 bg-background">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/40 border-b font-semibold text-muted-foreground">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-input text-primary h-3.5 w-3.5 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-semibold text-foreground/85">Name</th>
                <th className="p-3 font-semibold text-foreground/85">Role</th>
                <th className="p-3 font-semibold text-foreground/85">Municipality</th>
                <th className="p-3 font-semibold text-foreground/85">Status</th>
                <th className="p-3 w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCitizens.length > 0 ? (
                filteredCitizens.map((citizen) => {
                  const isChecked = selectedIds.includes(citizen.id);
                  return (
                    <tr
                      key={citizen.id}
                      className={`transition-colors hover:bg-muted/5 ${
                        isChecked ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      <td className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRowToggle(citizen.id)}
                          className="rounded border-input text-primary h-3.5 w-3.5 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-medium text-foreground">
                        {citizen.name}
                      </td>
                      <td className="p-3 text-muted-foreground font-sans">
                        {citizen.role}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {citizen.municipality}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] py-0.5 px-2 rounded-md ${
                            citizen.status === "active"
                              ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                              : "bg-amber-500/10 border-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                          }`}
                        >
                          {citizen.status}
                        </Badge>
                      </td>
                      <td className="p-3 w-12 text-center">
                        <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground/80 hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No registry rows match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected rows summary output console */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-sans mt-2 px-1">
          <span>Showing {filteredCitizens.length} of {mockCitizens.length} entries</span>
          <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-primary">
            checked_ids: [{selectedIds.join(", ") || "none"}]
          </span>
        </div>

      </div>
    </div>
  );
}
