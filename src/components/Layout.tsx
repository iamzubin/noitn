import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, FileText, Trash2, Clock, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { useDocumentStore } from '../stores/documentStore'
import { HistoryPanel } from './editor/HistoryPanel'

// LayoutProps defines the shape of props passed to Layout component
interface LayoutProps {
  children: React.ReactNode
}

// Renders the custom title bar for the frameless Electron window
// Includes drag support via WebkitAppRegion and application title
// Positioned at the top of the window with transparent background
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

// Renders the content of the sidebar including document list and controls
// collapsed: Boolean indicating if sidebar is in compact mode
// onHistoryClick: Callback for when history button is clicked
function SidebarContent({ collapsed, onHistoryClick }: { 
  collapsed: boolean 
  onHistoryClick?: () => void
}) {
  // Get document state and actions from Zustand store
  const { documents, currentDocumentId, addDocument, selectDocument, deleteDocument } = useDocumentStore()
  // State for tracking which document is being renamed
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  // Get updateDocument action from store
  const updateDocument = useDocumentStore((state) => state.updateDocument)

  // Handler for creating a new document
  // Called when user clicks "New Document" button
  const handleNew = async () => {
    await addDocument('Untitled')
  }

  // Handler for deleting a document
  // Called when user clicks delete button on a document item
  // Shows confirmation dialog before deleting
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent event from bubbling up to document item
    if (confirm('Delete this document?')) {
      await deleteDocument(id)
    }
  }

  // Handler for double-clicking a document to rename it
  // Sets editing state and populates input with current title
  const handleDoubleClick = (doc: { id: string; title: string }) => {
    setEditingId(doc.id)
    setEditTitle(doc.title)
  }

  // Handler for submitting document title changes
  // Called when user presses Enter or clicks away from rename input
  const handleSubmit = async (id: string) => {
    if (editTitle.trim()) {
      await updateDocument(id, editTitle.trim())
    }
    setEditingId(null)
  }

  // Render collapsed sidebar (icon-only view)
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        {/* New Document button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNew}
          className="h-8 w-8"
          title="New Document"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {/* History button (if provided) */}
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

        {/* Spacer to push document icons to top */}
        <div className="flex-1" />
        
        {/* Recent documents (max 5) */}
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

  // Render expanded sidebar (full view with document list)
  return (
    <div className="p-2">
      {/* New Document button (full width) */}
      <button
        onClick={handleNew}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Document
      </button>

      {/* History button (full width) */}
      {onHistoryClick && (
        <button
          onClick={onHistoryClick}
          className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <Clock className="h-4 w-4" />
          History
        </button>
      )}

      {/* Documents section header */}
      <div className="mt-4">
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Documents
          </span>
        </div>
        {/* Document list */}
        {documents.map((doc: { id: string; title: string }) => (
          <div
            key={doc.id}
            /* Select document on click (unless currently renaming) */
            onClick={() => editingId !== doc.id && selectDocument(doc.id)}
            /* Enable renaming on double-click */
            onDoubleClick={() => handleDoubleClick(doc)}
            className={`
              group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors
              hover:bg-accent
              ${currentDocumentId === doc.id ? 'bg-accent text-foreground' : 'text-muted-foreground'}
            `}
          >
            <FileText className="h-4 w-4 shrink-0" />
            {/* Input field for renaming document */}
            {editingId === doc.id ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleSubmit(doc.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(doc.id)}
                className="flex-1 bg-background border border-input rounded px-1 py-0.5 text-foreground text-sm outline-none"
                autoFocus
                onClick={(e) => e.stopPropagation()} // Prevent click from triggering select
              />
            ) : (
              /* Document title (truncated if too long) */
              <span className="flex-1 truncate">{doc.title}</span>
            )}
            {/* Delete button (hidden by default, shows on hover) */}
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

// Renders the sidebar container with collapsible functionality
// collapsed: Boolean indicating if sidebar is collapsed
// onToggleCollapse: Callback for when collapse/expand button is clicked
// onHistoryClick: Callback for when history button is clicked
function Sidebar({ collapsed, onToggleCollapse, onHistoryClick }: { 
  collapsed: boolean
  onToggleCollapse: () => void
  onHistoryClick?: () => void
}) {
  // Get theme state and toggle function from useTheme hook
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

// Main layout component that structures the application UI
// children: The content to be displayed in the main area (typically the Editor)
// Manages sidebar collapsed state and history panel visibility
export function Layout({ children }: LayoutProps) {
  // State for tracking sidebar collapsed/expanded state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // State for tracking history panel open/closed state
  const [historyOpen, setHistoryOpen] = useState(false)

  // Preview a version in read-only mode without restoring
  // Called when user clicks on a version in the history panel
  const handleVersionPreview = (version: any) => {
    const { currentDocumentId } = useDocumentStore.getState()
    if (currentDocumentId && version.content) {
      // Set preview version ID which will also set read-only mode
      useDocumentStore.getState().setPreviewVersionId(version.id)
      useDocumentStore.getState().saveCurrentBlocks(version.content)
    }
  }

  // This function is passed to HistoryPanel as onVersionRestore prop
  // It handles saving current state as new version and setting read-only mode
  // Called when user selects a version from the history panel and clicks "Restore"
  const handleVersionRestore = async (version: any) => {
    // Save current state as new version before restoring
    // This ensures we don't lose current work when viewing old versions
    const { currentDocumentId, currentBlocks } = useDocumentStore.getState()
    if (currentDocumentId && currentBlocks) {
      await useDocumentStore.getState().saveCurrentBlocks(currentBlocks)
    }
    
    // Set preview version ID which will also set read-only mode
    useDocumentStore.getState().setPreviewVersionId(version.id)
    
    // Load the version content into the editor
    if (currentDocumentId && version.content) {
      // Select the document (ensures it's active)
      useDocumentStore.getState().selectDocument(currentDocumentId)
      // Note: The actual content loading happens through the LoadContentPlugin
      // when currentBlocks is updated in the store
      // We directly update currentBlocks to trigger the LoadContentPlugin
      useDocumentStore.getState().saveCurrentBlocks(version.content)
    }
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
      
      <HistoryPanel 
        open={historyOpen} 
        onOpenChange={setHistoryOpen} 
        onVersionRestore={handleVersionRestore}
        onVersionPreview={handleVersionPreview}
      />
    </div>
  )
}
