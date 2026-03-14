import { useEffect, useState, useMemo } from 'react'
import { X, RotateCcw, GitBranch, GitCommit } from 'lucide-react'
import { Version, loadVersions } from '../../lib/versions'
import { useDocumentStore } from '../../stores/documentStore'
import { Button } from '../ui/button'

interface HistoryPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVersionRestore: (version: Version) => void
  onVersionPreview: (version: Version) => void
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

// Determine if a version is on the main line or a branch
function isBranchVersion(version: Version): boolean {
  return version.parentId !== null && version.parentId !== undefined
}

// Format version for display - like a git commit hash short
function formatVersionId(id: string): string {
  return id.substring(0, 7)
}

export function HistoryPanel({ open, onOpenChange, onVersionRestore, onVersionPreview }: HistoryPanelProps) {
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

  // Handle version click - preview the version and select it
  const handleVersionClick = (version: Version) => {
    setSelectedVersionId(version.id)
    onVersionPreview(version)
  }

  const handleRestore = async () => {
    if (!selectedVersionId) return
    
    const version = versions.find(v => v.id === selectedVersionId)
    if (version) {
      await onVersionRestore(version)
      setSelectedVersionId(null)
      onOpenChange(false)
    }
  }

  // Separate main line versions from branch versions
  const mainLineVersions = useMemo(() => {
    return versions.filter((v: Version) => !isBranchVersion(v))
  }, [versions])
  
  const branchVersions = useMemo(() => {
    return versions.filter((v: Version) => isBranchVersion(v))
  }, [versions])

  const selectedVersion = useMemo(() => {
    return versions.find(v => v.id === selectedVersionId)
  }, [versions, selectedVersionId])

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      <div className={`
        fixed right-0 top-0 bottom-0 w-96 bg-zinc-950 border-l border-zinc-800 z-50
        transform transition-transform duration-200 ease-out
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-zinc-400" />
            <h2 className="font-semibold text-zinc-100">History</h2>
            <span className="text-xs text-zinc-500">{versions.length} commits</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-7 w-7 hover:bg-zinc-800"
          >
            <X className="h-4 w-4 text-zinc-400" />
          </Button>
        </div>
        
        {/* Commit Tree */}
        <div className="p-2 overflow-auto h-[calc(100vh-120px)]">
          {loading ? (
            <p className="text-sm text-zinc-500 p-4">Loading history...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-zinc-500 p-4">No commits yet. Start editing to create history.</p>
          ) : (
            <div className="relative">
              {/* Main line commits */}
              <div className="relative pl-2">
                {mainLineVersions.map((version, index) => {
                  const isLast = index === mainLineVersions.length - 1
                  const isSelected = selectedVersionId === version.id
                  const isHead = index === 0
                  
                  return (
                  <div
                    key={version.id}
                    onClick={() => handleVersionClick(version)}
                    className={`
                      group relative flex items-start py-3 px-3 rounded-lg cursor-pointer 
                      transition-all duration-150
                      ${isSelected
                        ? 'bg-orange-950/30 border border-orange-800/50' 
                        : 'hover:bg-zinc-900/50 border border-transparent'}
                    `}
                  >
                    {/* Rail line - positioned to align with commit nodes */}
                    {!isLast && (
                      <div className={`absolute left-[19px] top-10 w-px ${
                        isSelected ? 'bg-orange-600' : 'bg-zinc-700'
                      }`} style={{ height: 'calc(100% - 24px)' }} />
                    )}
                    
                    {/* Commit node - centered on rail */}
                    <div className={`
                      relative z-10 mt-1.5 h-3 w-3 rounded-full shrink-0 ring-4 ring-zinc-950
                      ${isHead ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : isSelected ? 'bg-orange-500' : 'bg-zinc-600 group-hover:bg-zinc-400'}
                    `} />
                    
                    <div className="flex-1 min-w-0 ml-3">
                      {/* Commit message */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-200 truncate">
                          {version.message || formatDate(version.createdAt)}
                        </span>
                      </div>
                      
                      {/* Meta info */}
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="font-mono text-zinc-600">{formatVersionId(version.id)}</span>
                        <span>{version.wordCount} words</span>
                        <span>{formatDate(version.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
              
              {/* Branch commits */}
              {branchVersions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  {/* Branch header - aligned with rail */}
                  <div className="flex items-center gap-2 pl-2 py-2 mb-2">
                    <GitBranch className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-medium text-orange-400">Branches</span>
                    <span className="text-xs text-zinc-600">{branchVersions.length}</span>
                  </div>
                  
                  <div className="relative pl-2">
                    {branchVersions.map((version, index) => {
                      const isLast = index === branchVersions.length - 1
                      const isSelected = selectedVersionId === version.id
                      
                      return (
                      <div
                        key={version.id}
                        onClick={() => handleVersionClick(version)}
                        className={`
                          group relative flex items-start py-3 px-3 rounded-lg cursor-pointer 
                          transition-all duration-150
                          ${isSelected 
                            ? 'bg-orange-950/30 border border-orange-800/50' 
                            : 'hover:bg-zinc-900/50 border border-transparent'}
                        `}
                      >
                        {/* Branch line - aligned with main rail */}
                        {!isLast && (
                          <div className={`absolute left-[19px] top-10 w-px ${
                            isSelected ? 'bg-orange-600' : 'bg-zinc-700'
                          }`} style={{ height: 'calc(100% - 24px)' }} />
                        )}
                        
                        {/* Branch node - centered on rail */}
                        <div className={`
                          relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ring-4 ring-zinc-950
                          ${isSelected 
                            ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' 
                            : 'bg-zinc-600 group-hover:bg-zinc-400'}
                        `} />
                        
                        <div className="flex-1 min-w-0 ml-3">
                          {/* Branch name pill */}
                          <div className="flex items-center gap-2 mb-1">
                            {version.branchName && (
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${
                                isSelected
                                  ? 'bg-orange-950/50 text-orange-400 border-orange-800/50'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }`}>
                                <GitBranch className="h-2.5 w-2.5" />
                                {version.branchName}
                              </span>
                            )}
                          </div>
                          
                          {/* Commit message */}
                          <span className="text-sm text-zinc-300 block truncate mb-1">
                            {version.message || formatDate(version.createdAt)}
                          </span>
                          
                          {/* Meta info */}
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span className="font-mono text-orange-600">{formatVersionId(version.id)}</span>
                            <span>{version.wordCount} words</span>
                            <span>{formatDate(version.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with restore button */}
        {selectedVersion && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950/90 backdrop-blur border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Selected</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm text-zinc-200 truncate">{selectedVersion.message || formatDate(selectedVersion.createdAt)}</p>
                <p className="text-xs text-zinc-500">{formatVersionId(selectedVersion.id)} • {selectedVersion.wordCount} words</p>
              </div>
              <Button
                size="sm"
                onClick={handleRestore}
                className="bg-orange-600 hover:bg-orange-500 text-white border-0"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" />
                Restore
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
