# Noitn - Learnings

Session learnings, pitfalls, and decisions go here.

---

## Session 1: Electron + React + TypeScript Setup

**Date:** 2026-03-14
**What worked:**
- Using esbuild to compile main.ts/preload.ts for Electron (faster than ts-node)
- Strict TypeScript with separate tsconfig.electron.json
- electron-builder with `--mac --dir` for quick dev builds

**What didn't:**
- Had old index.html with demo content - replaced with React entry point
- Initially used CommonJS require in main.ts, switched to ES imports

**Decision:**
- Use esbuild for Electron compilation, not ts-node (simpler)
- Keep Electron files in root, React in /src
- Build order: `npm run build` (Vite) → `npm run build:electron` (esbuild) → electron-builder

---

## Session X: [Title]

**Date:** 
**What worked:**
- 

**What didn't:**
- 

**Decision:**
- 

---

## How to Use

After each session, document:
1. What you learned
2. What to avoid
3. Architecture decisions made