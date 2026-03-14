import { useEffect, useState } from 'react'
import { Clock, RotateCcw, GitBranch, ChevronRight, X } from 'lucide-react'
import { Version, loadVersions } from '../../lib/versions'
import { useDocumentStore } from '../../stores/documentStore'
import { Button } from '../ui/button'

interface HistoryPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

function VersionItem({ 
  version, 
  isFirst,
  onRestore,
  onBranch 
}: { 
  version: Version
  isFirst: boolean
  onRestore: () => void
  onBranch: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative">
      <div className="absolute left-3 top-8 bottom-0 w-px bg-border" />
      
      <div className="relative flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-accent/50 transition-colors">
        <div className={`mt-2 h-2 w-2 rounded-full shrink-0 ${isFirst ? 'bg-primary' : 'bg-muted-foreground/50'}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm font-medium hover:text-foreground text-foreground transition-colors"
            >
              <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
              {version.message || formatDate(version.createdAt)}
            </button>
            <span className="text-xs text-muted-foreground">{version.wordCount} words</span>
          </div>
          
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(version.createdAt)}
          </p>
          
          {expanded && (
            <div className="mt-2 flex items-center gap-2">
              {!isFirst && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRestore}
                  className="h-7 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restore
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onBranch}
                className="h-7 text-xs"
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Branch
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HistoryPanel({ open, onOpenChange }: HistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  
  const currentDocumentId = useDocumentStore((state) => state.currentDocumentId)
  const saveCurrentBlocks = useDocumentStore((state) => state.saveCurrentBlocks)

  useEffect(() => {
    if (open && currentDocumentId) {
      setLoading(true)
      loadVersions(currentDocumentId)
        .then(setVersions)
        .finally(() => setLoading(false))
    }
  }, [open, currentDocumentId])

  const handleRestore = async (version: Version) => {
    if (!confirm('Restore this version? Current content will be saved as a new version.')) {
      return
    }
    
    await saveCurrentBlocks(version.content)
    onOpenChange(false)
  }

  const handleBranch = async (version: Version) => {
    // For now, just restore as a new branch point
    // Could add more sophisticated branch UI later
    await handleRestore(version)
  }

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      <div className={`
        fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-border z-50
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <h2 className="font-semibold">Version History</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 overflow-auto h-[calc(100vh-60px)]">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading history...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No versions yet. Start editing to create versions.</p>
          ) : (
            <div className="space-y-1">
              {versions.map((version, index) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  isFirst={index === 0}
                  onRestore={() => handleRestore(version)}
                  onBranch={() => handleBranch(version)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
