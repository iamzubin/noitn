import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, LexicalCommand, createCommand, EditorState } from 'lexical'
import { $createHeadingNode, $isHeadingNode, QuoteNode } from '@lexical/rich-text'
import { $createListNode, $createListItemNode, $isListNode } from '@lexical/list'
import { $createCodeNode, CodeNode } from '@lexical/code'
import { $getRoot, ElementNode, TextNode } from 'lexical'

export const INSERT_ORDERED_LIST_COMMAND: LexicalCommand<void> = createCommand('INSERT_ORDERED_LIST_COMMAND')
export const INSERT_UNORDERED_LIST_COMMAND: LexicalCommand<void> = createCommand('INSERT_UNORDERED_LIST_COMMAND')
export const INSERT_CODE_BLOCK_COMMAND: LexicalCommand<void> = createCommand('INSERT_CODE_BLOCK_COMMAND')
export const INSERT_QUOTE_COMMAND: LexicalCommand<void> = createCommand('INSERT_QUOTE_COMMAND')

export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code'

export interface SlashCommandMenuOption {
  blockType: BlockType
  label: string
  icon: React.ReactNode
  keywords: string[]
}

const blockTypes: SlashCommandMenuOption[] = [
  {
    blockType: 'h1',
    label: 'Heading 1',
    icon: <span className="text-lg font-bold">H1</span>,
    keywords: ['heading', 'title', 'h1', 'big'],
  },
  {
    blockType: 'h2',
    label: 'Heading 2',
    icon: <span className="text-base font-semibold">H2</span>,
    keywords: ['heading', 'subtitle', 'h2', 'medium'],
  },
  {
    blockType: 'h3',
    label: 'Heading 3',
    icon: <span className="text-sm font-medium">H3</span>,
    keywords: ['heading', 'section', 'h3', 'small'],
  },
  {
    blockType: 'ul',
    label: 'Bullet List',
    icon: <span>•</span>,
    keywords: ['list', 'bullet', 'unordered', 'ul'],
  },
  {
    blockType: 'ol',
    label: 'Numbered List',
    icon: <span>1.</span>,
    keywords: ['list', 'numbered', 'ordered', 'ol'],
  },
  {
    blockType: 'quote',
    label: 'Quote',
    icon: <span>"</span>,
    keywords: ['quote', 'blockquote'],
  },
  {
    blockType: 'code',
    label: 'Code Block',
    icon: <span>{'</>}'}</span>,
    keywords: ['code', 'pre', 'codeblock'],
  },
]

function useSlashCommandMenu(editor: ReturnType<typeof useLexicalComposerContext>[0], options: SlashCommandMenuOption[]) {
  const [query, setQuery] = useState<string | null>(null)

  useEffect(() => {
    const removeHandler = editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        const anchor = selection.anchor
        const anchorNode = anchor.getNode()
        const parent = anchorNode.getParent()
        
        if ($isHeadingNode(parent) || $isListNode(parent) || parent instanceof QuoteNode || parent instanceof CodeNode) {
          return
        }

        const textContent = anchorNode.getTextContent()
        const slashIndex = textContent.lastIndexOf('/')

        if (slashIndex !== -1 && slashIndex === textContent.length - 1) {
          const queryText = textContent.slice(0, slashIndex)
          if (!queryText || queryText.endsWith(' ') || queryText.endsWith('\n')) {
            setQuery('')
            return
          }
        }

        if (slashIndex === -1) {
          setQuery(null)
        }
      })
    })

    return removeHandler
  }, [editor])

  const filteredOptions = useMemo(() => {
    if (query === null) return options
    if (query === '') return options

    const lowerQuery = query.toLowerCase()
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(lowerQuery)
      const keywordMatch = option.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
      return labelMatch || keywordMatch
    })
  }, [query, options])

  return { query, filteredOptions, setQuery }
}

export function SlashCommandMenuPlugin({ 
  onClose
}: { 
  onClose?: () => void
}) {
  const [editor] = useLexicalComposerContext()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const { query, filteredOptions, setQuery } = useSlashCommandMenu(editor, blockTypes)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setQuery(null)
    setSelectedIndex(0)
    if (onClose) {
      onClose()
    }
  }, [setQuery, onClose])

  useEffect(() => {
    if (query !== null && filteredOptions.length > 0) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({ x: rect.left, y: rect.bottom + 8 })
        setIsOpen(true)
        setSelectedIndex(0)
      }
    } else {
      setIsOpen(false)
    }
  }, [query, filteredOptions.length])

  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredOptions])

  const insertBlock = useCallback(
    (blockType: BlockType) => {
      editor.update(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        const anchor = selection.anchor
        const anchorNode = anchor.getNode()

        const parent = anchorNode.getParent()
        if ($isHeadingNode(parent) || $isListNode(parent) || parent instanceof QuoteNode || parent instanceof CodeNode) {
          return
        }

        const textContent = anchorNode.getTextContent()
        const slashIndex = textContent.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const textBeforeSlash = textContent.slice(0, slashIndex)
          
          if (textBeforeSlash === '') {
            anchorNode.remove()
          } else if (anchorNode instanceof TextNode) {
            anchorNode.setTextContent(textBeforeSlash)
          }
        }

        let blockNode: ElementNode
        switch (blockType) {
          case 'h1':
            blockNode = $createHeadingNode('h1')
            break
          case 'h2':
            blockNode = $createHeadingNode('h2')
            break
          case 'h3':
            blockNode = $createHeadingNode('h3')
            break
          case 'ul': {
            const listNode = $createListNode('bullet')
            const ulItem = $createListItemNode()
            listNode.append(ulItem)
            blockNode = listNode
            break
          }
          case 'ol': {
            const listNode = $createListNode('number')
            const olItem = $createListItemNode()
            listNode.append(olItem)
            blockNode = listNode
            break
          }
          case 'quote':
            blockNode = new QuoteNode()
            break
          case 'code':
            blockNode = $createCodeNode()
            break
          default:
            return
        }

        const root = $getRoot()
        const parentNode = anchorNode.getParent()
        
        if (parentNode) {
          parentNode.insertAfter(blockNode, true)
          const anchorText = anchorNode.getTextContent()
          if (!anchorText || anchorText === '/') {
            anchorNode.remove()
          }
        } else {
          root.append(blockNode)
        }

        blockNode.select()
      })
      closeMenu()
    },
    [editor, closeMenu]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredOptions.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredOptions[selectedIndex]) {
            insertBlock(filteredOptions[selectedIndex].blockType)
          }
          break
        case 'Escape':
          e.preventDefault()
          closeMenu()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredOptions, selectedIndex, insertBlock, closeMenu])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeMenu])

  if (!isOpen || filteredOptions.length === 0) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] py-1 rounded-lg bg-zinc-900/95 backdrop-blur shadow-lg border border-zinc-800/50"
      style={{ left: position.x, top: position.y }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {filteredOptions.map((option, index) => (
        <button
          key={option.blockType}
          className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
            index === selectedIndex
              ? 'bg-accent/20 text-accent'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
          onClick={() => insertBlock(option.blockType)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <span className="w-8 flex items-center justify-center text-white/60">{option.icon}</span>
          <span className="text-sm">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
