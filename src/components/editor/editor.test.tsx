import { describe, it, expect } from 'vitest'

describe('Editor components', () => {
  it('should export FloatingToolbar component', async () => {
    const module = await import('./FloatingToolbar')
    expect(module.FloatingToolbar).toBeDefined()
  })

  it('should export SlashCommandMenuPlugin component', async () => {
    const module = await import('./SlashCommandMenuPlugin')
    expect(module.SlashCommandMenuPlugin).toBeDefined()
  })

  it('should export DraggableBlockPlugin component', async () => {
    const module = await import('./DraggableBlockPlugin')
    expect(module.DraggableBlockPlugin).toBeDefined()
  })

  it('should export KeyboardShortcutsPlugin component', async () => {
    const module = await import('./KeyboardShortcutsPlugin')
    expect(module.KeyboardShortcutsPlugin).toBeDefined()
  })

  it('should export Editor component', async () => {
    const module = await import('./Editor')
    expect(module.Editor).toBeDefined()
  })
})
