export interface Document {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}

export interface Blocks {
  [documentId: string]: string
}

let appDataPath: string | null = null

async function getDataPath(): Promise<string> {
  if (!appDataPath) {
    appDataPath = await window.electronAPI.getAppPath()
    await window.electronAPI.ensureDir(appDataPath)
    await window.electronAPI.ensureDir(pathJoin(appDataPath, 'documents'))
    await window.electronAPI.ensureDir(pathJoin(appDataPath, 'blocks'))
  }
  return appDataPath
}

function pathJoin(...parts: string[]): string {
  return parts.join('/')
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export async function loadDocuments(): Promise<Document[]> {
  const dataPath = await getDataPath()
  const docsPath = pathJoin(dataPath, 'documents')
  const files = await window.electronAPI.readDir(docsPath)
  
  const documents: Document[] = []
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const content = await window.electronAPI.readFile(pathJoin(docsPath, file))
    if (content) {
      try {
        documents.push(JSON.parse(content))
      } catch {
        // skip invalid files
      }
    }
  }
  
  return documents.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function saveDocument(doc: Document): Promise<boolean> {
  const dataPath = await getDataPath()
  const filePath = pathJoin(dataPath, 'documents', `${doc.id}.json`)
  return window.electronAPI.writeFile(filePath, JSON.stringify(doc, null, 2))
}

export async function createDocument(title: string = 'Untitled'): Promise<Document> {
  const now = Date.now()
  const doc: Document = {
    id: generateId(),
    title,
    createdAt: now,
    updatedAt: now,
  }
  await saveDocument(doc)
  await saveBlocks(doc.id, JSON.stringify({
    root: {
      children: [
        {
          type: 'paragraph',
          children: []
        }
      ],
      type: 'root'
    }
  }))
  return doc
}

export async function loadBlocks(documentId: string): Promise<string | null> {
  const dataPath = await getDataPath()
  const filePath = pathJoin(dataPath, 'blocks', `${documentId}.json`)
  return window.electronAPI.readFile(filePath)
}

export async function saveBlocks(documentId: string, content: string): Promise<boolean> {
  const dataPath = await getDataPath()
  const filePath = pathJoin(dataPath, 'blocks', `${documentId}.json`)
  const success = await window.electronAPI.writeFile(filePath, content)
  
  if (success) {
    const docsPath = pathJoin(dataPath, 'documents', `${documentId}.json`)
    const existing = await window.electronAPI.readFile(docsPath)
    if (existing) {
      const doc = JSON.parse(existing) as Document
      doc.updatedAt = Date.now()
      await saveDocument(doc)
    }
  }
  
  return success
}

export async function deleteDocument(documentId: string): Promise<boolean> {
  const dataPath = await getDataPath()
  const docPath = pathJoin(dataPath, 'documents', `${documentId}.json`)
  const blockPath = pathJoin(dataPath, 'blocks', `${documentId}.json`)
  
  await window.electronAPI.deleteFile(docPath)
  await window.electronAPI.deleteFile(blockPath)
  
  return true
}

export async function ensureSampleDocument(): Promise<Document[]> {
  const docs = await loadDocuments()
  if (docs.length === 0) {
    const doc = await createDocument('Welcome to Noitn')
    await saveBlocks(doc.id, JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Welcome to Noitn! This is your first document.' }]
          }
        ],
        type: 'root'
      }
    }))
    return [doc]
  }
  return docs
}
