import { useEffect } from 'react'
import { ThemeProvider } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { useDocumentStore } from './stores/documentStore'
import { Editor } from './components/editor/Editor'

function AppContent() {
  const { currentDocumentId, isLoading } = useDocumentStore()

  useEffect(() => {
    useDocumentStore.getState().loadAll()
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        {currentDocumentId ? (
          <Editor />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Select a document or create a new one.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
