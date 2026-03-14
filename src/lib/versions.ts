export interface Version {
  id: string
  documentId: string
  parentId: string | null
  content: string
  message: string
  createdAt: number
  wordCount: number
}

export interface VersionTree {
  documentId: string
  versions: Version[]
}

let appDataPath: string | null = null

async function getDataPath(): Promise<string> {
  if (!appDataPath) {
    appDataPath = await window.electronAPI.getAppPath()
  }
  return appDataPath
}

function pathJoin(...parts: string[]): string {
  return parts.join('/')
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export async function loadVersions(documentId: string): Promise<Version[]> {
  const dataPath = await getDataPath()
  const versionsPath = pathJoin(dataPath, 'versions', documentId)
  
  try {
    const content = await window.electronAPI.readFile(pathJoin(versionsPath, 'versions.json'))
    if (content) {
      const tree: VersionTree = JSON.parse(content)
      return tree.versions.sort((a, b) => b.createdAt - a.createdAt)
    }
  } catch {
    // No versions yet
  }
  return []
}

async function saveVersionTree(documentId: string, versions: Version[]): Promise<void> {
  const dataPath = await getDataPath()
  const versionsPath = pathJoin(dataPath, 'versions', documentId)
  
  await window.electronAPI.ensureDir(versionsPath)
  
  const tree: VersionTree = { documentId, versions }
  await window.electronAPI.writeFile(
    pathJoin(versionsPath, 'versions.json'),
    JSON.stringify(tree, null, 2)
  )
}

export async function getLatestVersion(documentId: string): Promise<Version | null> {
  const versions = await loadVersions(documentId)
  return versions[0] || null
}

export async function createOrUpdateVersion(
  documentId: string,
  content: string,
  message: string = ''
): Promise<Version> {
  const versions = await loadVersions(documentId)
  const latestVersion = versions[0]
  
  const wordCount = countWords(content)
  const newVersion: Version = {
    id: generateId(),
    documentId,
    parentId: latestVersion?.id || null,
    content,
    message,
    createdAt: Date.now(),
    wordCount,
  }
  
  if (latestVersion && shouldMergeVersions(latestVersion.content, content)) {
    // Update last version instead of creating new
    versions[0] = {
      ...latestVersion,
      content,
      message: message || latestVersion.message,
      createdAt: Date.now(),
      wordCount,
    }
    await saveVersionTree(documentId, versions)
    return versions[0]
  }
  
  // Create new version
  versions.unshift(newVersion)
  await saveVersionTree(documentId, versions)
  return newVersion
}

export function countWords(text: string): number {
  try {
    const parsed = JSON.parse(text)
    return countWordsInLexical(parsed)
  } catch {
    return text.split(/\s+/).filter(Boolean).length
  }
}

function countWordsInLexical(node: any): number {
  if (!node) return 0
  
  if (node.type === 'text' && node.text) {
    return node.text.split(/\s+/).filter(Boolean).length
  }
  
  if (node.children && Array.isArray(node.children)) {
    return node.children.reduce((sum: number, child: any) => sum + countWordsInLexical(child), 0)
  }
  
  if (node.root?.children) {
    return node.root.children.reduce((sum: number, child: any) => sum + countWordsInLexical(child), 0)
  }
  
  return 0
}

function getBlockTypes(content: string): Set<string> {
  const types = new Set<string>()
  try {
    const parsed = JSON.parse(content)
    if (parsed.root?.children) {
      collectBlockTypes(parsed.root.children, types)
    }
  } catch {
    // ignore
  }
  return types
}

function collectBlockTypes(nodes: any[], types: Set<string>) {
  for (const node of nodes) {
    if (node.type && node.type !== 'root') {
      types.add(node.type)
    }
    if (node.children && Array.isArray(node.children)) {
      collectBlockTypes(node.children, types)
    }
  }
}

function shouldMergeVersions(oldContent: string, newContent: string): boolean {
  // Check if new block types were added (e.g., new widget, list, etc.)
  const oldTypes = getBlockTypes(oldContent)
  const newTypes = getBlockTypes(newContent)
  
  for (const type of newTypes) {
    if (!oldTypes.has(type)) {
      return false // New block type added - create new version
    }
  }
  
  // Check word count change
  const oldWordCount = countWords(oldContent)
  const newWordCount = countWords(newContent)
  
  if (oldWordCount === 0 && newWordCount === 0) return true
  if (oldWordCount === 0 || newWordCount === 0) return false
  
  const diff = Math.abs(newWordCount - oldWordCount)
  const percentChange = (diff / oldWordCount) * 100
  
  // Merge if change is less than 10%
  return percentChange < 10
}

export async function restoreVersion(documentId: string, versionId: string): Promise<string | null> {
  const versions = await loadVersions(documentId)
  const version = versions.find(v => v.id === versionId)
  return version?.content || null
}

export async function createBranch(
  documentId: string,
  fromVersionId: string,
  message: string = 'Branch'
): Promise<Version | null> {
  const versions = await loadVersions(documentId)
  const fromVersion = versions.find(v => v.id === fromVersionId)
  
  if (!fromVersion) return null
  
  const newVersion: Version = {
    id: generateId(),
    documentId,
    parentId: fromVersionId,
    content: fromVersion.content,
    message,
    createdAt: Date.now(),
    wordCount: fromVersion.wordCount,
  }
  
  versions.unshift(newVersion)
  await saveVersionTree(documentId, versions)
  return newVersion
}
