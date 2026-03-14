import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

interface LayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

function TitleBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-4 bg-transparent border-b border-border/20 z-[100]"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 pl-16">
        <span className="text-sm font-semibold">NOITN</span>
      </div>
      <div 
        className="flex items-center gap-1" 
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="h-7 w-7 hover:bg-accent/50"
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  )
}

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="relative h-screen bg-background text-foreground">
      <TitleBar />
      {sidebar && (
        <aside className="fixed left-0 top-10 bottom-0 w-64 border-r border-border/50 bg-card/50 flex flex-col pt-3">
          <ScrollArea className="flex-1">
            {sidebar}
          </ScrollArea>
        </aside>
      )}
      
      <main className="pt-10 h-screen flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto pt-12 px-6 pb-6 pl-68">
          {children}
        </div>
      </main>
    </div>
  )
}
