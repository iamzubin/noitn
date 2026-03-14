# Noitn

A local-first desktop note-taking app with rich text editing and AI-generated interactive widgets. Built with Electron, React, and Lexical.

## Features

- **Rich Text Editor** - Powered by Lexical with formatting (bold, italic, underline), headings, lists, quotes, and code blocks
- **Block-Based Editing** - Type `/` to insert different block types
- **Widgets** - Interactive widgets: Timer, Checkbox, Counter, Table, Placeholder
- **Slash Commands** - Quick block insertion via `/`
- **Version History** - Git-like timeline with smart merging
- **Local Storage** - All data stored in JSON files (no cloud)
- **Dark/Light Theme** - Sunset Noir theme with orange accents

## Tech Stack

- **Electron** - Desktop framework
- **React + TypeScript + Vite** - Frontend
- **Lexical** - Rich text editor
- **shadcn/ui** - UI components
- **Zustand** - State management

## Development

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build
npm run build

# Run tests
npm test
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Ctrl/Cmd + 1 | Heading 1 |
| Ctrl/Cmd + 2 | Heading 2 |
| Ctrl/Cmd + 3 | Heading 3 |

## License

MIT
