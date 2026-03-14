import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, $createParagraphNode } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $isHeadingNode, QuoteNode } from '@lexical/rich-text'
import { $createListNode, $createListItemNode } from '@lexical/list'
import { $createCodeNode } from '@lexical/code'
import { useFloating } from '@floating-ui/react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, Type, List, ListOrdered, Quote, Code } from 'lucide-react'

function ToolbarButton({ onClick, isActive, children, title }: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      title={title}
      className={`size-8 transition-opacity duration-200 ${isActive ? 'bg-accent/20 text-accent' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
    >
      {children}
    </Button>
  )
}

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [headingLevel, setHeadingLevel] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    strategy: 'fixed',
  })

  const updateToolbar = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setIsCollapsed(true)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    if (rect.width === 0) {
      setIsCollapsed(true)
      return
    }

    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
    setIsCollapsed(false)

    editor.read(() => {
      const sel = $getSelection()
      if ($isRangeSelection(sel)) {
        setIsBold(sel.hasFormat('bold'))
        setIsItalic(sel.hasFormat('italic'))
        setIsUnderline(sel.hasFormat('underline'))

        const anchorNode = sel.anchor.getNode()
        const parent = anchorNode.getParent()
        if ($isHeadingNode(parent)) {
          setHeadingLevel(parent.getTag())
        } else {
          setHeadingLevel(null)
        }
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      1
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    document.addEventListener('selectionchange', updateToolbar)
    return () => document.removeEventListener('selectionchange', updateToolbar)
  }, [updateToolbar])

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  const formatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')

  const setHeading = (level: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        if (headingLevel === level) {
          $setBlocksType(selection, () => {
            return $createParagraphNode()
          })
          setHeadingLevel(null)
        } else {
          $setBlocksType(selection, () => $createHeadingNode(level))
          setHeadingLevel(level)
        }
      }
    })
  }

  const insertBulletList = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const listNode = $createListNode('bullet')
        const listItem = $createListItemNode()
        listNode.append(listItem)
        selection.insertNodes([listNode])
      }
    })
  }

  const insertNumberedList = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const listNode = $createListNode('number')
        const listItem = $createListItemNode()
        listNode.append(listItem)
        selection.insertNodes([listNode])
      }
    })
  }

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const quoteNode = new QuoteNode()
        selection.insertNodes([quoteNode])
      }
    })
  }

  const insertCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode()
        selection.insertNodes([codeNode])
      }
    })
  }

  if (isCollapsed) {
    return null
  }

  return (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        position: 'fixed',
        left: position.x,
        top: position.y - 8,
        transform: 'translate(-50%, -100%)',
      }}
      className="flex items-center gap-0.5 px-1 py-1 rounded-lg bg-zinc-900/95 backdrop-blur shadow-lg border border-zinc-800/50"
      onMouseDown={(e) => e.preventDefault()}
    >
      <ToolbarButton onClick={formatBold} isActive={isBold} title="Bold (Ctrl+B)">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={formatItalic} isActive={isItalic} title="Italic (Ctrl+I)">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={formatUnderline} isActive={isUnderline} title="Underline (Ctrl+U)">
        <Underline className="size-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-zinc-700 mx-0.5" />
      <ToolbarButton onClick={() => setHeading('h1')} isActive={headingLevel === 'h1'} title="Heading 1">
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => setHeading('h2')} isActive={headingLevel === 'h2'} title="Heading 2">
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => setHeading('h3')} isActive={headingLevel === 'h3'} title="Heading 3">
        <Heading3 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => setHeading('h1')} isActive={!headingLevel} title="Paragraph">
        <Type className="size-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-zinc-700 mx-0.5" />
      <ToolbarButton onClick={insertBulletList} title="Bullet List">
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={insertNumberedList} title="Numbered List">
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={insertQuote} title="Quote">
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={insertCodeBlock} title="Code Block">
        <Code className="size-4" />
      </ToolbarButton>
    </div>
  )
}