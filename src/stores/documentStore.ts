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
import { createOrUpdateVersion, createBranchVersion } from '../lib/versions'

interface DocumentState {
  documents: Document[]
  currentDocumentId: string | null
  currentBlocks: string | null
  isLoading: boolean
  isReadOnly: boolean
  previewVersionId: string | null  // Track which version we're previewing (for branching)
  
  loadAll: () => Promise<void>
  selectDocument: (id: string) => Promise<void>
  addDocument: (title?: string) => Promise<Document>
  updateDocument: (id: string, title: string) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  saveCurrentBlocks: (blocks: string) => Promise<void>
  setReadOnly: (readOnly: boolean) => void
  setPreviewVersionId: (versionId: string | null) => void
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocumentId: null,
  currentBlocks: null,
  isLoading: true,
  isReadOnly: false,
  previewVersionId: null,
  
  // Loads all documents from storage and selects the first one if available
  // Called from main.tsx on app startup
  loadAll: async () => {
    set({ isLoading: true })
    const docs = await ensureSampleDocument()
    set({ documents: docs, isLoading: false })
    
    if (docs.length > 0) {
      await get().selectDocument(docs[0].id)
    }
  },
  
  // Selects a document by ID and loads its content
  // Called from Sidebar when user clicks on a document
  // Also called internally when switching documents
  selectDocument: async (id: string) => {
    const { currentDocumentId, currentBlocks } = get()
    // Save current document's content before switching (if different document)
    if (currentDocumentId && currentBlocks && currentDocumentId !== id) {
      await saveBlocks(currentDocumentId, currentBlocks)
      await createOrUpdateVersion(currentDocumentId, currentBlocks, 'Auto-save on switch')
    }
    const blocks = await loadBlocks(id)
    set({ currentDocumentId: id, currentBlocks: blocks })
  },
  
  // Creates a new document with optional title
  // Called from Sidebar when user clicks "New Document" button
  addDocument: async (title?: string) => {
    const doc = await createDocument(title)
    const docs = await loadDocuments()
    set({ documents: docs })
    await get().selectDocument(doc.id)
    return doc
  },
  
  // Updates a document's title
  // Called from Sidebar when user finishes editing a document title
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
  
  // Deletes a document by ID
  // Called from Sidebar when user clicks delete button on a document
  deleteDocument: async (id: string) => {
    await storageDeleteDocument(id)
    const docs = await loadDocuments()
    set({ documents: docs })
    
    // If we deleted the current document, select another one or clear state
    if (get().currentDocumentId === id) {
      if (docs.length > 0) {
        await get().selectDocument(docs[0].id)
      } else {
        set({ currentDocumentId: null, currentBlocks: null })
      }
    }
  },
  
  // Saves the current editor content for the active document
  // Called from Editor's SaveContentPlugin on debounced save
  // Also called from selectDocument when switching documents
  // If in read-only mode (previewing old version), creates a new branch
  saveCurrentBlocks: async (blocks: string) => {
    const id = get().currentDocumentId
    const { isReadOnly, previewVersionId } = get()
    
    if (id) {
      await saveBlocks(id, blocks)
      
      // If we're in read-only mode (previewing an old version), create a branch
      if (isReadOnly && previewVersionId) {
        await createBranchVersion(id, previewVersionId, blocks, 'Branch from old version')
        // Clear the preview mode after creating the branch
        set({ currentBlocks: blocks, previewVersionId: null, isReadOnly: false })
      } else {
        await createOrUpdateVersion(id, blocks)
        set({ currentBlocks: blocks })
      }
    }
  },
  
  // Sets the read-only state for the editor
  // Called from Layout when restoring a version to prevent editing old content
  setReadOnly: (readOnly: boolean) => set({ isReadOnly: readOnly }),
  
  // Sets the preview version ID (the version we're currently viewing)
  // Called from Layout when user clicks on a version to preview
  setPreviewVersionId: (versionId: string | null) => set({ previewVersionId: versionId, isReadOnly: versionId !== null }),
}))
