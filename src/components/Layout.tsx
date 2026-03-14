import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, FileText, Trash2, Clock, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { useDocumentStore } from '../stores/documentStore'
import { HistoryPanel } from './editor/HistoryPanel'

interface LayoutProps {
  children: React.ReactNode
}

function TitleBar() {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-10 flex items-center px-4 bg-transparent border-b border-border/20 z-[100]"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 pl-16">
        <span className="text-sm font-semibold">NOITN</span>
      </div>
    </div>
  )
}

function SidebarContent({ collapsed, onHistoryClick }: { 
  collapsed: boolean 
  onHistoryClick?: () => void
}) {
  const { documents, currentDocumentId, addDocument, selectDocument, deleteDocument } = useDocumentStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const updateDocument = useDocumentStore((state) => state.updateDocument)

  const handleNew = async () => {
    await addDocument('Untitled')
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Delete this document?')) {
      await deleteDocument(id)
    }
  }

  const handleDoubleClick = (doc: { id: string; title: string }) => {
    setEditingId(doc.id)
    setEditTitle(doc.title)
  }

  const handleSubmit = async (id: string) => {
    if (editTitle.trim()) {
      await updateDocument(id, editTitle.trim())
    }
    setEditingId(null)
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNew}
          className="h-8 w-8"
          title="New Document"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {onHistoryClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onHistoryClick}
            className="h-8 w-8"
            title="History"
          >
            <Clock className="h-4 w-4" />
          </Button>
        )}

        <div className="flex-1" />
        
        {documents.slice(0, 5).map((doc: { id: string; title: string }) => (
          <Button
            key={doc.id}
            variant="ghost"
            size="icon"
            onClick={() => selectDocument(doc.id)}
            className={`h-8 w-8 ${currentDocumentId === doc.id ? 'bg-accent' : ''}`}
            title={doc.title}
          >
            <FileText className="h-4 w-4" />
          </Button>
        ))}
      </div>
    )
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

      {onHistoryClick && (
        <button
          onClick={onHistoryClick}
          className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <Clock className="h-4 w-4" />
          History
        </button>
      )}

      <div className="mt-4">
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Documents
          </span>
        </div>
        {documents.map((doc: { id: string; title: string }) => (
          <div
            key={doc.id}
            onClick={() => editingId !== doc.id && selectDocument(doc.id)}
            onDoubleClick={() => handleDoubleClick(doc)}
            className={`
              group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors
              hover:bg-accent
              ${currentDocumentId === doc.id ? 'bg-accent text-foreground' : 'text-muted-foreground'}
            `}
          >
            <FileText className="h-4 w-4 shrink-0" />
            {editingId === doc.id ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleSubmit(doc.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(doc.id)}
                className="flex-1 bg-background border border-input rounded px-1 py-0.5 text-foreground text-sm outline-none"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 truncate">{doc.title}</span>
            )}
            <button 
              onClick={(e) => handleDelete(e, doc.id)}
              className="opacity-0 group-hover:opacity-100 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Sidebar({ collapsed, onToggleCollapse, onHistoryClick }: { 
  collapsed: boolean
  onToggleCollapse: () => void
  onHistoryClick?: () => void
}) {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className={`fixed left-0 top-10 bottom-0 border-r border-border/50 bg-card/50 flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-64'}`}>
      <ScrollArea className="flex-1">
        <SidebarContent collapsed={collapsed} onHistoryClick={onHistoryClick} />
      </ScrollArea>
      
      <div className="p-2 border-t border-border/50 flex items-center justify-between">
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const handleVersionRestore = async (version: any) => {
    // This function will be called when a version is selected for restore
    // The actual logic is handled in Editor.tsx which has access to the editor instance
    // For now, we'll just log it - the real implementation is in Editor
    console.log('Version selected for restore:', version)
  }

  return (
    <div className="relative h-screen bg-background text-foreground">
      <TitleBar />
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onHistoryClick={() => setHistoryOpen(true)}
      />
      
      <main className="pt-10 h-screen flex flex-col overflow-hidden">
        <div className={`flex-1 overflow-auto pt-12 px-6 pb-6 transition-all duration-200 ${sidebarCollapsed ? 'pl-[56px]' : 'pl-[256px]'}`}>
          {children}
        </div>
      </main>
      
       <HistoryPanel open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  )
}
