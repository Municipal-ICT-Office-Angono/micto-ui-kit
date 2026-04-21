"use client";

import * as React from "react";
import { InertiaPagination } from "@/components/inertia-pagination";
// import { Link } from "@inertiajs/react";

const demoLinks = [
  { active: false, label: "&laquo; Previous", url: "/users?page=2" },
  { active: false, label: "1", url: "/users?page=1" },
  { active: false, label: "2", url: "/users?page=2" },
  { active: true, label: "3", url: "/users?page=3" },
  { active: false, label: "4", url: "/users?page=4" },
  { active: false, label: "5", url: "/users?page=5" },
  { active: false, label: "...", url: null },
  { active: false, label: "12", url: "/users?page=12" },
  { active: false, label: "Next &raquo;", url: "/users?page=4" },
];

export default function InertiaPaginationDemo() {
  return (
    <div className="flex justify-center">
      <InertiaPagination
        links={demoLinks}
        /* To use the SPA feature of Inertia.js, uncomment the following line:
         * LinkComponent={Link}
         */
      />
    </div>
  );
}
