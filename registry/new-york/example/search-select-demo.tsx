"use client";

import * as React from "react";
import { SearchSelect } from "@/components/micto/search-select";

// --- Mock Data ---

const staticRoles = [
  { value: "admin", label: "Administrator", description: "Full access to all system resources" },
  { value: "manager", label: "Manager", description: "Can manage and edit staff records" },
  { value: "officer", label: "Office Assistant", description: "Standard database viewer and clerk" },
  { value: "editor", label: "Editor", description: "Responsible for publishing dynamic content" },
];

const mockUsers = [
  {
    value: "nehry",
    label: "Nehry Oliver",
    description: "nehry@angono.gov.ph",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80",
  },
  {
    value: "reyna",
    label: "Reyna Garcia",
    description: "reyna@angono.gov.ph",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80",
  },
  {
    value: "mark",
    label: "Mark Alvarez",
    description: "mark.a@angono.gov.ph",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80",
  },
  {
    value: "clara",
    label: "Clara Bautista",
    description: "clara@angono.gov.ph",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop&auto=format&q=80",
  },
];

const mockCities = [
  { value: "angono", label: "Angono", description: "Rizal, Art Capital of the Philippines" },
  { value: "taytay", label: "Taytay", description: "Rizal, Garments Capital" },
  { value: "antipolo", label: "Antipolo City", description: "Rizal, Pilgrimage Capital" },
  { value: "binangonan", label: "Binangonan", description: "Rizal, Fishing Municipality" },
  { value: "cainta", label: "Cainta", description: "Rizal, Gateway to the East" },
  { value: "morong", label: "Morong", description: "Rizal, Historical Landmark" },
];

export default function SearchSelectDemo() {
  const [role, setRole] = React.useState<string>("manager");
  const [assignees, setAssignees] = React.useState<string[]>(["nehry", "clara"]);

  // Async search simulator
  const handleCitySearch = async (query: string) => {
    // Simulate real API latency
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    if (!query) return mockCities;
    return mockCities.filter((city) =>
      city.label.toLowerCase().includes(query.toLowerCase()) ||
      city.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-12">
      {/* 1. Single Select with Subtext Description */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Single Search Select (With Subtexts)
          </h4>
          <p className="text-xs text-muted-foreground">
            Filters static configurations instantly. Currently selected:{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-primary font-bold">{role || "none"}</code>
          </p>
        </div>
        <div className="pt-2">
          <SearchSelect
            options={staticRoles}
            value={role}
            onChange={(val) => setRole(val)}
            placeholder="Select user access role..."
            searchPlaceholder="Filter roles..."
          />
        </div>
      </div>

      {/* 2. Multi-Select Assignees with Avatars */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Multi-Select Combobox (With Avatars & Badges)
          </h4>
          <p className="text-xs text-muted-foreground">
            Select multiple assignees. Chips render as closable pills inside the trigger.
          </p>
        </div>
        <div className="pt-2">
          <SearchSelect
            options={mockUsers}
            value={assignees}
            onChange={(val) => setAssignees(val)}
            multiple
            placeholder="Assign members..."
            searchPlaceholder="Filter members..."
          />
        </div>
      </div>

      {/* 3. Simulated Async Fetching */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Async API Stream (Debounced Search)
          </h4>
          <p className="text-xs text-muted-foreground">
            Simulates dynamic server requests. Type a Rizal municipality name to see debounced fetching shimmers in action.
          </p>
        </div>
        <div className="pt-2">
          <SearchSelect
            onSearch={handleCitySearch}
            placeholder="Search Rizal municipalities..."
            searchPlaceholder="Type to fetch..."
            emptyMessage="No municipalities match your search query."
          />
        </div>
      </div>
    </div>
  );
}

