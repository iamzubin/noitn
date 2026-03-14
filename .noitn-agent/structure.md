# Noitn - Project Structure

## Root Files

```
noitn/
├── SPEC.md                   # Project specification
├── AGENTS.md                 # Agent instructions
├── package.json              # Dependencies
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind config
├── tsconfig.json            # TypeScript config
├── main.ts                  # Electron main process
├── preload.ts               # Electron preload script
├── index.html               # Entry HTML
└── dist/                   # Production build
```

## Source (`/src`)

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Root component
├── vite-env.d.ts            # TypeScript declarations
├── index.css                # Tailwind input
├── index.output.css         # Tailwind output
│
├── components/
│   ├── Layout.tsx          # App layout with titlebar/sidebar
│   ├── editor/
│   │   ├── Editor.tsx           # Lexical editor
│   │   ├── EditorToolbar.tsx    # Toolbar with formatting buttons
│   │   └── KeyboardShortcutsPlugin.tsx  # Keyboard shortcuts
│   └── ui/                 # shadcn components (50+ files)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── scroll-area.tsx
│       └── ...
│
├── hooks/
│   ├── useTheme.tsx        # Theme toggle hook
│   └── use-mobile.ts       # Mobile detection
│
├── lib/
│   ├── storage.ts         # File operations (IPC)
│   └── utils.ts            # Utility functions (cn())
│
└── stores/
    └── documentStore.ts   # Zustand document state
```

## Build Outputs

```
├── main.js                 # Compiled main.ts
├── preload.js              # Compiled preload.ts
└── dist/                  # Vite production build
    └── index.html
```

## Data Storage

Located at: `~/Library/Application Support/noitn/`

```
noitn/
├── documents/
│   ├── {id}.json    # Document metadata
│   └── ...
└── blocks/
    ├── {id}.json    # Lexical editor state
    └── ...
```
