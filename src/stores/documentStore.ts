import { create } from 'zustand'
import type { Document } from '../lib/storage'
import { 
  loadDocuments, 
  createDocument, 
  saveDocument, 
  deleteDocument as storageDeleteDocument,
  loadBlocks,
  saveBlocks,
  ensureSampleDocument
} from '../lib/storage'

interface DocumentState {
  documents: Document[]
  currentDocumentId: string | null
  currentBlocks: string | null
  isLoading: boolean
  
  loadAll: () => Promise<void>
  selectDocument: (id: string) => Promise<void>
  addDocument: (title?: string) => Promise<Document>
  updateDocument: (id: string, title: string) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  saveCurrentBlocks: (blocks: string) => Promise<void>
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocumentId: null,
  currentBlocks: null,
  isLoading: true,

  loadAll: async () => {
    set({ isLoading: true })
    const docs = await ensureSampleDocument()
    set({ documents: docs, isLoading: false })
    
    if (docs.length > 0) {
      await get().selectDocument(docs[0].id)
    }
  },

  selectDocument: async (id: string) => {
    const { currentDocumentId, currentBlocks } = get()
    if (currentDocumentId && currentBlocks && currentDocumentId !== id) {
      await saveBlocks(currentDocumentId, currentBlocks)
    }
    const blocks = await loadBlocks(id)
    set({ currentDocumentId: id, currentBlocks: blocks })
  },

  addDocument: async (title?: string) => {
    const doc = await createDocument(title)
    const docs = await loadDocuments()
    set({ documents: docs })
    await get().selectDocument(doc.id)
    return doc
  },

  updateDocument: async (id: string, title: string) => {
    const docs = get().documents
    const doc = docs.find(d => d.id === id)
    if (doc) {
      doc.title = title
      doc.updatedAt = Date.now()
      await saveDocument(doc)
      set({ documents: await loadDocuments() })
    }
  },

  deleteDocument: async (id: string) => {
    await storageDeleteDocument(id)
    const docs = await loadDocuments()
    set({ documents: docs })
    
    if (get().currentDocumentId === id) {
      if (docs.length > 0) {
        await get().selectDocument(docs[0].id)
      } else {
        set({ currentDocumentId: null, currentBlocks: null })
      }
    }
  },

  saveCurrentBlocks: async (blocks: string) => {
    const id = get().currentDocumentId
    if (id) {
      await saveBlocks(id, blocks)
      set({ currentBlocks: blocks })
    }
  },
}))
