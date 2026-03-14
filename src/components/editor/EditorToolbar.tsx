import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, Undo, Redo } from 'lucide-react'

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
      className={isActive ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground'}
    >
      {children}
    </Button>
  )
}

export function EditorToolbar() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [headingLevel, setHeadingLevel] = useState<string | null>(null)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))

      const anchorNode = selection.anchor.getNode()
      const parent = anchorNode.getParent()
      if ($isHeadingNode(parent)) {
        setHeadingLevel(parent.getTag())
      } else {
        setHeadingLevel(null)
      }
    }
  }, [])

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

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  }

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  }

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
  }

  const setHeading = (level: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        if (headingLevel === level) {
          $setBlocksType(selection, () => {
            const { $createParagraphNode } = require('lexical')
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

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined)
  }

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined)
  }

  return (
    <div className="flex items-center gap-1 border-b border-border p-2 bg-background/80 backdrop-blur sticky top-0 z-10">
      <ToolbarButton onClick={handleUndo} title="Undo">
        <Undo className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={handleRedo} title="Redo">
        <Redo className="size-4" />
      </ToolbarButton>
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarButton onClick={formatBold} isActive={isBold} title="Bold (Ctrl+B)">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={formatItalic} isActive={isItalic} title="Italic (Ctrl+I)">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={formatUnderline} isActive={isUnderline} title="Underline (Ctrl+U)">
        <Underline className="size-4" />
      </ToolbarButton>
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarButton onClick={() => setHeading('h1')} isActive={headingLevel === 'h1'} title="Heading 1">
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => setHeading('h2')} isActive={headingLevel === 'h2'} title="Heading 2">
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => setHeading('h3')} isActive={headingLevel === 'h3'} title="Heading 3">
        <Heading3 className="size-4" />
      </ToolbarButton>
    </div>
  )
}