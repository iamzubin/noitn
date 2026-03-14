import '@testing-library/jest-dom'
import { vi } from 'vitest'

const mockElectronAPI = {
  getAppPath: vi.fn().mockResolvedValue('/test/path'),
  getVersion: vi.fn().mockResolvedValue('1.0.0'),
  onMenuAction: vi.fn(),
  ensureDir: vi.fn().mockResolvedValue(true),
  readDir: vi.fn().mockResolvedValue([]),
  readFile: vi.fn().mockResolvedValue(null),
  writeFile: vi.fn().mockResolvedValue(true),
  deleteFile: vi.fn().mockResolvedValue(true),
  minimizeWindow: vi.fn(),
  maximizeWindow: vi.fn(),
  closeWindow: vi.fn(),
}

window.electronAPI = mockElectronAPI as Window['electronAPI']
