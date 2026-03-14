import { describe, it, expect } from 'vitest'
import { 
  loadVersions, 
  restoreVersion, 
  countWords 
} from './versions'

describe('versions', () => {
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
})
