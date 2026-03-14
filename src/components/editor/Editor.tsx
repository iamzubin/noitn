import { useEffect, useCallback, useRef } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeNode } from '@lexical/code'
import { LinkNode } from '@lexical/link'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { $getRoot, ParagraphNode } from 'lexical'
import { useDocumentStore } from '../../stores/documentStore'
import { FloatingToolbar } from './FloatingToolbar'
import { KeyboardShortcutsPlugin } from './KeyboardShortcutsPlugin'
import { SlashCommandMenuPlugin } from './SlashCommandMenuPlugin'
import { DraggableBlockPlugin } from './DraggableBlockPlugin'
import { WidgetNode } from './widgets/WidgetNode'

const theme = {
  paragraph: 'mb-2',
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-semibold mb-3',
    h3: 'text-xl font-medium mb-2',
  },
}

function onError(error: Error) {
  console.error(error)
}

// Loads editor content from storage when documentId changes
// Called automatically by React when documentId prop changes
// Prevents re-loading same content on every render via loadedRef
function LoadContentPlugin({ documentId }: { documentId: string }) {
  const [editor] = useLexicalComposerContext()
  const currentBlocks = useDocumentStore((state) => state.currentBlocks)
  const loadedRef = useRef<string | null>(null)

  // Reset loadedRef when documentId changes to force reload
  useEffect(() => {
    loadedRef.current = null
  }, [documentId])

  // Load content into editor when it changes in storage
  // Compares with loadedRef to avoid unnecessary re-renders
  useEffect(() => {
    if (currentBlocks && currentBlocks !== loadedRef.current) {
      loadedRef.current = currentBlocks
      try {
        const parsed = JSON.parse(currentBlocks)
        const editorState = editor.parseEditorState(JSON.stringify(parsed))
        editor.setEditorState(editorState)
      } catch (e) {
        console.error('Failed to load blocks:', e)
        // Fallback to empty editor with heading if parsing fails
        editor.update(() => {
          const root = $getRoot()
          root.clear()
          const paragraph = new ParagraphNode()
          const heading = new HeadingNode('h1')
          heading.append(paragraph)
          root.append(heading)
        }, { discrete: true })
      }
    }
  }, [editor, currentBlocks, documentId])

  return null
}

// Saves editor content to storage with debounce to prevent excessive saves
// Called automatically by Lexical's update listener on every change
// Debounced to 1 second to balance responsiveness with performance
function SaveContentPlugin() {
  const [editor] = useLexicalComposerContext()
  const currentDocumentId = useDocumentStore((state) => state.currentDocumentId)
  const saveCurrentBlocks = useDocumentStore((state) => state.saveCurrentBlocks)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Debounced save handler to prevent saving on every keystroke
  // Clears previous timeout and sets new one on each change
  const handleSave = useCallback(() => {
    if (!currentDocumentId) return
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Save after 1 second of inactivity
    timeoutRef.current = setTimeout(() => {
      editor.update(() => {
        try {
          const editorState = editor.getEditorState()
          const json = editorState.toJSON()
          const serialized = JSON.stringify(json)
          saveCurrentBlocks(serialized)
        } catch (e) {
          console.error('Failed to save:', e)
        }
      })
    }, 1000)
  }, [editor, currentDocumentId, saveCurrentBlocks])

  // Register update listener to call handleSave on editor changes
  // Cleanup function removes listener when component unmounts
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        handleSave()
      })
    })
  }, [editor, handleSave])

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return null
}

// Main editor component that renders the Lexical editor with all plugins
// Called from App.tsx to display the editor interface
// Handles read-only mode for version history viewing
export function Editor() {
  // Get current document ID and read-only state from Zustand store
  const currentDocumentId = useDocumentStore((state) => state.currentDocumentId)
  const isReadOnly = useDocumentStore((state) => state.isReadOnly)

  // LexicalComposer configuration
  // namespace: Unique identifier for this editor instance
  // theme: Custom styling for different node types
  // onError: Error handler for Lexical errors
  // nodes: List of Lexical nodes to register (heading, quote, list, etc.)
  // editable: Boolean to enable/disable editing based on read-only state
  const initialConfig = {
    namespace: 'NoitnEditor',
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode, TableNode, TableCellNode, TableRowNode, WidgetNode],
    editable: !isReadOnly,
  }

  // Return null if no document is selected (prevents errors)
  if (!currentDocumentId) {
    return null
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex flex-col h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="flex-1 min-h-[200px] outline-none p-4"
              readOnly={isReadOnly}
            />
          }
          placeholder={<div className="absolute top-16 left-4 text-muted-foreground">{isReadOnly ? 'Viewing version history' : 'Start typing...'}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        {!isReadOnly && <FloatingToolbar />}
        {!isReadOnly && <KeyboardShortcutsPlugin />}
        {!isReadOnly && <SlashCommandMenuPlugin />}
        {!isReadOnly && <DraggableBlockPlugin />}
        <LoadContentPlugin documentId={currentDocumentId} />
        {!isReadOnly && <SaveContentPlugin />}
      </div>
    </LexicalComposer>
  )
}
