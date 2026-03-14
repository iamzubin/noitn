'use client'

import { useState, useEffect } from 'react'
import { WidgetConfig } from './WidgetNode'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox as CheckboxComponent } from '@/components/ui/checkbox'
import { Plus, Minus, Play, Pause, RotateCcw } from 'lucide-react'

interface WidgetComponentProps {
  config: WidgetConfig
  onConfigChange?: (config: WidgetConfig) => void
}

export function WidgetComponent({ config, onConfigChange }: WidgetComponentProps) {
  switch (config.type) {
    case 'timer':
      return <TimerWidget data={config.data} onChange={(data) => onConfigChange?.({ type: 'timer', data })} />
    case 'checkbox':
      return <CheckboxWidget data={config.data} onChange={(data) => onConfigChange?.({ type: 'checkbox', data })} />
    case 'counter':
      return <CounterWidget data={config.data} onChange={(data) => onConfigChange?.({ type: 'counter', data })} />
    case 'table':
      return <TableWidget data={config.data} onChange={(data) => onConfigChange?.({ type: 'table', data })} />
    case 'placeholder':
      return <PlaceholderWidget data={config.data} onChange={(data) => onConfigChange?.({ type: 'placeholder', data })} />
    default:
      return <div className="text-muted-foreground">Unknown widget type</div>
  }
}

function TimerWidget({ data, onChange }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const [seconds, setSeconds] = useState(Number(data.seconds) || 60)
  const [isRunning, setIsRunning] = useState(false)
  const [remaining, setRemaining] = useState(Number(data.seconds) || 60)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, remaining])

  const handleReset = () => {
    setRemaining(seconds)
    setIsRunning(false)
  }

  const handleSecondsChange = (newSeconds: number) => {
    setSeconds(newSeconds)
    setRemaining(newSeconds)
    onChange({ ...data, seconds: newSeconds })
  }

  const formatTime = ( secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-4 w-64 bg-zinc-900/50 border-zinc-800">
      <div className="text-sm text-muted-foreground mb-2">{String(data.label) || 'Timer'}</div>
      <div className="text-3xl font-mono text-center mb-3">{formatTime(remaining)}</div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Input
          type="number"
          value={seconds}
          onChange={(e) => handleSecondsChange(Number(e.target.value))}
          className="w-20 h-8"
        />
      </div>
    </Card>
  )
}

function CheckboxWidget({ data, onChange }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const checked = Boolean(data.checked)

  return (
    <Card className="p-3 w-fit bg-zinc-900/50 border-zinc-800">
      <div className="flex items-center gap-2">
        <CheckboxComponent
          checked={checked}
          onCheckedChange={(checked) => onChange({ ...data, checked })}
        />
        <span className="text-sm">{String(data.label) || 'Task'}</span>
      </div>
    </Card>
  )
}

function CounterWidget({ data, onChange }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const [value, setValue] = useState(Number(data.value) || 0)

  const increment = () => {
    const newValue = value + 1
    setValue(newValue)
    onChange({ ...data, value: newValue })
  }

  const decrement = () => {
    const newValue = value - 1
    setValue(newValue)
    onChange({ ...data, value: newValue })
  }

  return (
    <Card className="p-4 w-48 bg-zinc-900/50 border-zinc-800">
      <div className="text-sm text-muted-foreground mb-2">{String(data.label) || 'Count'}</div>
      <div className="flex items-center justify-center gap-3">
        <Button size="icon" variant="outline" onClick={decrement}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-2xl font-semibold w-12 text-center">{value}</span>
        <Button size="icon" variant="outline" onClick={increment}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}

function TableWidget({ data }: { data: Record<string, unknown>; onChange?: (data: Record<string, unknown>) => void }) {
  const rows = Number(data.rows) || 3
  const columns = Number(data.columns) || 3

  return (
    <Card className="p-3 bg-zinc-900/50 border-zinc-800 overflow-auto">
      <div className="text-sm text-muted-foreground mb-2">{rows} x {columns} Table</div>
      <table className="w-full border-collapse">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="border border-zinc-700 p-2 min-w-[60px]">
                  <Input className="h-6 text-sm" placeholder={`${rowIndex + 1},${colIndex + 1}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function PlaceholderWidget({ data }: { data: Record<string, unknown>; onChange?: (data: Record<string, unknown>) => void }) {
  const text = String(data.text) || 'Placeholder'

  return (
    <Card className="p-4 w-64 bg-zinc-900/50 border-zinc-800 border-dashed">
      <div className="text-center text-muted-foreground">{text}</div>
    </Card>
  )
}