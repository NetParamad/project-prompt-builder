"use client";

import type { RequirementKey } from "@/lib/domain";
import { useConfig } from "@/lib/store/useConfig";

const FIELDS: {
  key: RequirementKey;
  label: string;
  placeholder: string;
  rows: number;
}[] = [
  { key: "projectName", label: "Project Name", placeholder: "Acme POS", rows: 1 },
  {
    key: "description",
    label: "Project Description",
    placeholder: "Build a POS system for a small restaurant.",
    rows: 2,
  },
  {
    key: "targetUsers",
    label: "Target Users",
    placeholder: "Cashiers, managers, admins",
    rows: 1,
  },
  {
    key: "mainFeatures",
    label: "Main Features",
    placeholder: "Product management\nInventory management\nOrder management\nSales reports",
    rows: 4,
  },
  {
    key: "businessRequirements",
    label: "Business Requirements",
    placeholder: "User roles, receipt printing, …",
    rows: 2,
  },
  {
    key: "technicalRequirements",
    label: "Technical Requirements",
    placeholder: "Multi-tenant, audit log, …",
    rows: 2,
  },
  {
    key: "additionalInstructions",
    label: "Additional Instructions",
    placeholder: "Anything else the agent should know",
    rows: 2,
  },
];

export function RequirementsForm() {
  const requirements = useConfig((s) => s.requirements);
  const setRequirement = useConfig((s) => s.setRequirement);

  return (
    <section aria-label="Project requirements" className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Project Requirements</h3>
      {FIELDS.map((field) => (
        <label key={field.key} className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{field.label}</span>
          <textarea
            value={requirements[field.key]}
            onChange={(e) => setRequirement(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows}
            className="resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-400"
          />
        </label>
      ))}
    </section>
  );
}
