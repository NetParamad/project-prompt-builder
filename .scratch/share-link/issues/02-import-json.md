# 02: Import config JSON

**What to build:** "Import .json" button accepting both our export shape
(`{configuration, ...}`) and bare configs, through the same sanitize path as
share links. Invalid files show an inline error; importing over manual edits
reuses the ConfirmDialog. `customSkills` arrays import back to raw text.

**Blocked by:** None (can start immediately).

**Status:** done

- [ ] lint + typecheck + tests + build green
