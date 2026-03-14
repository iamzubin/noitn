import { useEffect, useState } from 'react'
import { ThemeProvider } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { useDocumentStore } from './stores/documentStore'
import { Editor } from './components/editor/Editor'

function DocumentItem({ 
  doc, 
  isActive, 
  onSelect, 
  onDelete 
}: { 
  doc: { id: string; title: string }
  isActive: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(doc.title)
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)
  const updateDocument = useDocumentStore((state) => state.updateDocument)

  useEffect(() => {
    if (isEditing && inputRef) {
      inputRef.focus()
      inputRef.select()
    }
  }, [isEditing, inputRef])

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTitle(doc.title)
  }

  const handleSubmit = async () => {
    if (title.trim() && title !== doc.title) {
      await updateDocument(doc.id, title.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(doc.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div
      onClick={isEditing ? undefined : onSelect}
      onDoubleClick={handleDoubleClick}
      className={`
        group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors
        hover:bg-accent
        ${isActive ? 'bg-accent text-foreground' : 'text-muted-foreground'}
      `}
    >
      <FileText className="h-4 w-4 shrink-0" />
      {isEditing ? (
        <div className="flex-1 flex items-center gap-1">
          <input
            ref={setInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSubmit}
            className="flex-1 bg-background border border-input rounded px-1 py-0.5 text-foreground text-sm outline-none"
          />
        </div>
      ) : (
        <span className="flex-1 truncate">{doc.title}</span>
      )}
      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

function Sidebar() {
  const { documents, currentDocumentId, addDocument, selectDocument, deleteDocument } = useDocumentStore()

  const handleNew = async () => {
    await addDocument('Untitled')
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Delete this document?')) {
      await deleteDocument(id)
    }
  }

  return (
    <div className="p-2">
      <button
        onClick={handleNew}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Document
      </button>

      <div className="mt-4">
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Documents
          </span>
        </div>
        {documents.map((doc: { id: string; title: string }) => (
          <DocumentItem
            key={doc.id}
            doc={doc}
            isActive={currentDocumentId === doc.id}
            onSelect={() => selectDocument(doc.id)}
            onDelete={(e) => handleDelete(e, doc.id)}
          />
        ))}
      </div>
    </div>
  )
}

function AppContent() {
  const { currentDocumentId, isLoading } = useDocumentStore()

  useEffect(() => {
    useDocumentStore.getState().loadAll()
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout sidebar={<Sidebar />}>
      <div className="max-w-4xl mx-auto p-8">
        {currentDocumentId ? (
          <Editor />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Select a document or create a new one.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
