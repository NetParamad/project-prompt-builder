"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CATEGORY_MAP } from "@/lib/data/catalog";
import {
  EMPTY_REQUIREMENTS,
  type Preset,
  type ProjectRequirements,
  type PromptMode,
  type RequirementKey,
} from "@/lib/domain";
import type { SharedConfig } from "@/lib/share/codec";

export type ToggleResult = "selected" | "deselected" | "capped" | "ignored";

interface ConfigState {
  selections: Record<string, string[]>;
  requirements: ProjectRequirements;
  mode: PromptMode;
  customSkillsRaw: string;
  manualEdit: string | null;
  toggleOption: (categoryId: string, optionId: string) => ToggleResult;
  setRequirement: (key: RequirementKey, value: string) => void;
  setMode: (mode: PromptMode) => void;
  setCustomSkillsRaw: (value: string) => void;
  applyPreset: (preset: Preset) => void;
  applySharedConfig: (config: SharedConfig) => void;
  setManualEdit: (text: string) => void;
  clearManualEdit: () => void;
  clearAll: () => void;
}

const initialSelections = (): Record<string, string[]> => ({});

type PersistedConfig = Pick<ConfigState, "selections" | "requirements" | "mode" | "customSkillsRaw">;

export const useConfig = create<ConfigState>()(
  persist(
    (set) => ({
      selections: initialSelections(),
      requirements: { ...EMPTY_REQUIREMENTS },
      mode: "standard",
      customSkillsRaw: "",
      manualEdit: null,

      toggleOption: (categoryId, optionId) => {
        const category = CATEGORY_MAP[categoryId];
        if (!category || !category.options.some((o) => o.id === optionId)) {
          return "ignored";
        }
        let result: ToggleResult = "selected";
        set((s) => {
          const current = s.selections[categoryId] ?? [];
          if (category.selection === "single") {
            if (current[0] === optionId) {
              result = "deselected";
              return { selections: { ...s.selections, [categoryId]: [] } };
            }
            result = "selected";
            return { selections: { ...s.selections, [categoryId]: [optionId] } };
          }
          if (current.includes(optionId)) {
            result = "deselected";
            return {
              selections: {
                ...s.selections,
                [categoryId]: current.filter((id) => id !== optionId),
              },
            };
          }
          if (
            category.maxSelections !== undefined &&
            current.length >= category.maxSelections
          ) {
            result = "capped";
            return s;
          }
          result = "selected";
          return {
            selections: { ...s.selections, [categoryId]: [...current, optionId] },
          };
        });
        return result;
      },

      setRequirement: (key, value) =>
        set((s) => ({
          requirements: { ...s.requirements, [key]: value },
          manualEdit: null,
        })),

      setMode: (mode) => set({ mode, manualEdit: null }),

      setCustomSkillsRaw: (value) =>
        set({ customSkillsRaw: value, manualEdit: null }),

      applyPreset: (preset) =>
        set((s) => {
          const merged: Record<string, string[]> = { ...s.selections };
          for (const [key, value] of Object.entries(preset.config)) {
            if (value !== undefined) merged[key] = value;
          }
          return {
            selections: merged,
            requirements: { ...s.requirements, ...preset.requirements },
            manualEdit: null,
          };
        }),

      setManualEdit: (text) => set({ manualEdit: text }),
      clearManualEdit: () => set({ manualEdit: null }),

      applySharedConfig: (config) =>
        set({
          selections: { ...config.selections },
          requirements: { ...config.requirements },
          mode: config.mode,
          customSkillsRaw: config.customSkillsRaw,
          manualEdit: null,
        }),

      clearAll: () =>
        set({
          selections: initialSelections(),
          requirements: { ...EMPTY_REQUIREMENTS },
          mode: "standard",
          customSkillsRaw: "",
          manualEdit: null,
        }),
    }),
    { name: "ppb-config-v1", partialize: (s): PersistedConfig => ({
        selections: { ...s.selections },
        requirements: { ...s.requirements },
        mode: s.mode,
        customSkillsRaw: s.customSkillsRaw,
      }),
    },
  ),
);
