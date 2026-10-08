# Warn-only validation with Frontend-single and DB-max-2

Validation warns and explains but never blocks, except Frontend is single-select and Database caps at two (flagged as multi-DB). Chosen over strict blocking because unusual combos are sometimes intentional; the value is Warning → Explain → Let the user decide.
