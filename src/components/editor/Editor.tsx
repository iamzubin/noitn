import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, $createHeadingNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeNode } from '@lexical/code'
import { LinkNode } from '@lexical/link'
import { $getRoot, EditorState, $createParagraphNode } from 'lexical'

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

function InitialContentPlugin({ onReady }: { onReady?: () => void }) {
  const [editor] = useLexicalComposerContext()

  editor.update(() => {
    const root = $getRoot()
    if (root.getFirstChild() === null) {
      const heading = $createHeadingNode('h1')
      heading.append($createParagraphNode())
      root.append(heading)
      if (onReady) onReady()
    }
  })

  return null
}

export function Editor({
  onChange,
  onReady,
}: {
  onChange?: (state: EditorState) => void
  onReady?: () => void
}) {
  const initialConfig = {
    namespace: 'NoitnEditor',
    theme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode, CodeNode, LinkNode],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[200px] outline-none p-4" />
          }
          placeholder={<div className="absolute top-4 left-4 text-muted-foreground">Start typing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange ?? (() => {})} />
        <InitialContentPlugin onReady={onReady} />
      </div>
    </LexicalComposer>
  )
}
