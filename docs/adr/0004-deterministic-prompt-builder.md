# Deterministic template prompt builder, no LLM in MVP

Prompts are built by pure functions (normalize → stack-intel → section builders → assemble by mode) with conditional paragraphs for known stack interactions. Chosen over LLM generation/polish so output is testable, offline, and free; Regenerate simply rebuilds from the current Configuration.
