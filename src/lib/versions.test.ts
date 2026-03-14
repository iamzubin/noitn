import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  loadVersions, 
  restoreVersion, 
  countWords,
  createOrUpdateVersion
} from './versions'

const mockElectronAPI = {
  getAppPath: vi.fn().mockResolvedValue('/test/path'),
  ensureDir: vi.fn().mockResolvedValue(true),
  readFile: vi.fn().mockResolvedValue(null),
  writeFile: vi.fn().mockResolvedValue(true),
}

window.electronAPI = mockElectronAPI as unknown as Window['electronAPI']

describe('versions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockElectronAPI.readFile.mockResolvedValue(null)
  })

  describe('countWords', () => {
    it('should count words in plain text', () => {
      expect(countWords('hello world')).toBe(2)
      expect(countWords('one two three four five')).toBe(5)
      expect(countWords('')).toBe(0)
      expect(countWords('   ')).toBe(0)
    })

    it('should count words in Lexical JSON', () => {
      const lexicalContent = JSON.stringify({
        root: {
          children: [
            { type: 'text', text: 'Hello world' },
            { type: 'text', text: 'Another sentence' }
          ],
          type: 'root'
        }
      })
      expect(countWords(lexicalContent)).toBe(4)
    })
  })

  describe('loadVersions', () => {
    it('should return empty array when no versions exist', async () => {
      const versions = await loadVersions('test-doc')
      expect(versions).toEqual([])
    })
  })

  describe('restoreVersion', () => {
    it('should return null when version not found', async () => {
      const content = await restoreVersion('test-doc', 'nonexistent')
      expect(content).toBeNull()
    })
  })

  describe('createOrUpdateVersion', () => {
    it('should create new version when no versions exist', async () => {
      const result = await createOrUpdateVersion('test-doc', '{"root":{}}', 'First version')
      
      expect(result.message).toBe('First version')
      expect(mockElectronAPI.writeFile).toHaveBeenCalled()
    })

    it('should merge when change is less than 10%', async () => {
      const existingVersions = {
        documentId: 'test-doc',
        versions: [
          {
            id: 'v1',
            documentId: 'test-doc',
            content: JSON.stringify({ root: { children: [{ type: 'text', text: 'hello world' }] } }),
            message: 'Initial',
            createdAt: 1000,
            wordCount: 2
          }
        ]
      }
      
      mockElectronAPI.readFile.mockResolvedValue(JSON.stringify(existingVersions))
      
      const result = await createOrUpdateVersion('test-doc', JSON.stringify({ root: { children: [{ type: 'text', text: 'hello world!' }] } }), 'Updated')
      
      expect(result.id).toBe('v1')
      expect(result.message).toBe('Updated')
    })

    it('should create new version when change is more than 10%', async () => {
      const existingVersions = {
        documentId: 'test-doc',
        versions: [
          {
            id: 'v1',
            documentId: 'test-doc',
            content: JSON.stringify({ root: { children: [{ type: 'text', text: 'hello' }] } }),
            message: 'Initial',
            createdAt: 1000,
            wordCount: 1
          }
        ]
      }
      
      mockElectronAPI.readFile.mockResolvedValue(JSON.stringify(existingVersions))
      
      const result = await createOrUpdateVersion('test-doc', JSON.stringify({ root: { children: [{ type: 'text', text: 'hello world this is a much longer text' }] } }), 'Big update')
      
      expect(result.id).not.toBe('v1')
      expect(result.message).toBe('Big update')
    })

    it('should create new version when new block type is added', async () => {
      const existingVersions = {
        documentId: 'test-doc',
        versions: [
          {
            id: 'v1',
            documentId: 'test-doc',
            content: JSON.stringify({ root: { children: [{ type: 'text', text: 'hello' }] } }),
            message: 'Initial',
            createdAt: 1000,
            wordCount: 1
          }
        ]
      }
      
      mockElectronAPI.readFile.mockResolvedValue(JSON.stringify(existingVersions))
      
      const result = await createOrUpdateVersion('test-doc', JSON.stringify({ root: { children: [{ type: 'text', text: 'hello' }, { type: 'heading', tag: 'h1', children: [] }] } }), 'Added heading')
      
      expect(result.id).not.toBe('v1')
    })
  })
})
