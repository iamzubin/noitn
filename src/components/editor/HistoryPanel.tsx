import { useEffect, useState } from 'react'
import { Clock, X, RotateCcw } from 'lucide-react'
import { Version, loadVersions } from '../../lib/versions'
import { useDocumentStore } from '../../stores/documentStore'
import { Button } from '../ui/button'

interface HistoryPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVersionRestore: (version: Version) => void
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

export function HistoryPanel({ open, onOpenChange, onVersionRestore }: HistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
  
  const currentDocumentId = useDocumentStore((state) => state.currentDocumentId)

  useEffect(() => {
    if (open && currentDocumentId) {
      setLoading(true)
      loadVersions(currentDocumentId)
        .then(setVersions)
        .finally(() => setLoading(false))
    }
  }, [open, currentDocumentId])

  const handleRestore = async () => {
    if (!selectedVersionId) return
    
    const version = versions.find(v => v.id === selectedVersionId)
    if (version) {
      await onVersionRestore(version)
      setSelectedVersionId(null)
      onOpenChange(false)
    }
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
                <div
                  key={version.id}
                  onClick={() => setSelectedVersionId(version.id)}
                  className={`w-full relative flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-accent/50 transition-colors text-left ${
                    selectedVersionId === version.id ? 'bg-primary/20' : ''
                  }`}
                >
                  <div className="absolute left-3 top-8 bottom-0 w-px bg-border" />
                  
                  <div className={`mt-2 h-2 w-2 rounded-full shrink-0 ${index === 0 ? 'bg-primary' : 'bg-muted-foreground/50'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {version.message || formatDate(version.createdAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">{version.wordCount} words</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(version.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedVersionId && (
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="default"
              size="sm"
              onClick={handleRestore}
              className="w-full"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Restore Version
            </Button>
          </div>
        )}
      </div>
    </>
  )
}