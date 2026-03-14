import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode } from '@lexical/rich-text'
import { createCommand, type LexicalCommand } from 'lexical'

export const HEADING_1_COMMAND: LexicalCommand<void> = createCommand('HEADING_1')
export const HEADING_2_COMMAND: LexicalCommand<void> = createCommand('HEADING_2')
export const HEADING_3_COMMAND: LexicalCommand<void> = createCommand('HEADING_3')

export function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      HEADING_1_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h1'))
          }
        })
        return true
      },
      1
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      HEADING_2_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h2'))
          }
        })
        return true
      },
      1
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      HEADING_3_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h3'))
          }
        })
        return true
      },
      1
    )
  }, [editor])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === '1') {
          event.preventDefault()
          editor.dispatchCommand(HEADING_1_COMMAND, undefined)
        } else if (event.key === '2') {
          event.preventDefault()
          editor.dispatchCommand(HEADING_2_COMMAND, undefined)
        } else if (event.key === '3') {
          event.preventDefault()
          editor.dispatchCommand(HEADING_3_COMMAND, undefined)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  return null
}