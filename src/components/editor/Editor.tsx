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

function LoadContentPlugin({ documentId }: { documentId: string }) {
  const [editor] = useLexicalComposerContext()
  const currentBlocks = useDocumentStore((state) => state.currentBlocks)
  const loadedRef = useRef<string | null>(null)

  useEffect(() => {
    loadedRef.current = null
  }, [documentId])

  useEffect(() => {
    if (currentBlocks && currentBlocks !== loadedRef.current) {
      loadedRef.current = currentBlocks
      try {
        const parsed = JSON.parse(currentBlocks)
        const editorState = editor.parseEditorState(JSON.stringify(parsed))
        editor.setEditorState(editorState)
      } catch (e) {
        console.error('Failed to load blocks:', e)
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

function SaveContentPlugin() {
  const [editor] = useLexicalComposerContext()
  const currentDocumentId = useDocumentStore((state) => state.currentDocumentId)
  const saveCurrentBlocks = useDocumentStore((state) => state.saveCurrentBlocks)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSave = useCallback(() => {
    if (!currentDocumentId) return
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

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

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        handleSave()
      })
    })
  }, [editor, handleSave])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return null
}

export function Editor() {
  const currentDocumentId = useDocumentStore((state) => state.currentDocumentId)

  const initialConfig = {
    namespace: 'NoitnEditor',
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode, TableNode, TableCellNode, TableRowNode],
  }

  if (!currentDocumentId) {
    return null
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex flex-col h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="flex-1 min-h-[200px] outline-none p-4" />
          }
          placeholder={<div className="absolute top-16 left-4 text-muted-foreground">Start typing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <FloatingToolbar />
        <KeyboardShortcutsPlugin />
        <LoadContentPlugin documentId={currentDocumentId} />
        <SaveContentPlugin />
      </div>
    </LexicalComposer>
  )
}
