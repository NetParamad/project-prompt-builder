# 03: UX audit fixes

**Audit (dev server + structure + contrast math):** 1 h1, 112 keyboard-operable
buttons, 94 `aria-pressed` states, landmarks + `lang="en"` present. Contrast
AA-checked pairs — one FAIL found.

**Fixed:**
- Dialog defaulted focus to the destructive action → now focuses Cancel.
- No focus trap → Tab cycles inside the dialog.
- `text-amber-600` on `amber-50` = 3.07 (FAIL) → `amber-800` = 6.84 (AA-pass).

**Status:** done

- [x] lint + typecheck + tests (42) + build green
