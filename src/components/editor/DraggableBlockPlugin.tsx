import { useCallback, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin'
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical'
import { Plus, GripVertical } from 'lucide-react'

export function DraggableBlockPlugin() {
  const [editor] = useLexicalComposerContext()
  const menuRef = useRef<HTMLDivElement>(null)
  const targetLineRef = useRef<HTMLDivElement>(null)

  const insertParagraphBelow = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return

      const anchor = selection.anchor
      const anchorNode = anchor.getNode()
      const parent = anchorNode.getParent()

      if (parent) {
        const newParagraph = $createParagraphNode()
        parent.insertAfter(newParagraph, true)
        newParagraph.select()
      }
    })
  }, [editor])

  const isOnMenu = useCallback((element: HTMLElement): boolean => {
    return !!element.closest('.draggable-block-menu')
  }, [])

  const menuComponent = (
    <div
      ref={menuRef}
      className="draggable-block-menu flex items-center gap-0.5"
    >
      <button
        className="flex items-center justify-center w-5 h-5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
        title="Click to add below"
        onClick={insertParagraphBelow}
      >
        <Plus className="size-3.5" />
      </button>
      <div className="drag-handle flex items-center justify-center w-3 h-5 cursor-grab text-zinc-600 hover:text-zinc-400">
        <GripVertical className="size-3" />
      </div>
    </div>
  )

  const targetLineComponent = (
    <div ref={targetLineRef} className="draggable-block-target-line" />
  )

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={document.body}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={menuComponent}
      targetLineComponent={targetLineComponent}
      isOnMenu={isOnMenu}
    />
  )
}
