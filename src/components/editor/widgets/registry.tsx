import { WidgetType, WidgetConfig } from './WidgetNode'
import { Clock, CheckSquare, Hash, Table, Square } from 'lucide-react'

export interface WidgetDefinition {
  type: WidgetType
  label: string
  description: string
  icon: React.ReactNode
  defaultData: Record<string, unknown>
  fields: WidgetField[]
}

export interface WidgetField {
  name: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select'
  options?: string[]
  defaultValue: unknown
}

export const widgetRegistry: Record<WidgetType, WidgetDefinition> = {
  timer: {
    type: 'timer',
    label: 'Timer',
    description: 'A countdown timer',
    icon: <Clock className="w-4 h-4" />,
    defaultData: { seconds: 60, label: 'Timer' },
    fields: [
      { name: 'label', label: 'Label', type: 'text', defaultValue: 'Timer' },
      { name: 'seconds', label: 'Seconds', type: 'number', defaultValue: 60 },
    ],
  },
  checkbox: {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'A simple checkbox',
    icon: <CheckSquare className="w-4 h-4" />,
    defaultData: { label: 'Task', checked: false },
    fields: [
      { name: 'label', label: 'Label', type: 'text', defaultValue: 'Task' },
      { name: 'checked', label: 'Checked', type: 'boolean', defaultValue: false },
    ],
  },
  counter: {
    type: 'counter',
    label: 'Counter',
    description: 'A clickable counter',
    icon: <Hash className="w-4 h-4" />,
    defaultData: { value: 0, label: 'Count' },
    fields: [
      { name: 'label', label: 'Label', type: 'text', defaultValue: 'Count' },
      { name: 'value', label: 'Initial Value', type: 'number', defaultValue: 0 },
    ],
  },
  table: {
    type: 'table',
    label: 'Table',
    description: 'A simple table',
    icon: <Table className="w-4 h-4" />,
    defaultData: { rows: 3, columns: 3, data: [] },
    fields: [
      { name: 'rows', label: 'Rows', type: 'number', defaultValue: 3 },
      { name: 'columns', label: 'Columns', type: 'number', defaultValue: 3 },
    ],
  },
  placeholder: {
    type: 'placeholder',
    label: 'Placeholder',
    description: 'A placeholder for future content',
    icon: <Square className="w-4 h-4" />,
    defaultData: { text: 'Placeholder' },
    fields: [
      { name: 'text', label: 'Text', type: 'text', defaultValue: 'Placeholder' },
    ],
  },
}

export function getWidgetDefinition(type: WidgetType): WidgetDefinition {
  return widgetRegistry[type]
}

export function createDefaultWidgetConfig(type: WidgetType): WidgetConfig {
  const definition = widgetRegistry[type]
  const data: Record<string, unknown> = {}
  definition.fields.forEach((field) => {
    data[field.name] = field.defaultValue
  })
  return { type, data }
}

export const widgetTypes: WidgetType[] = Object.keys(widgetRegistry) as WidgetType[]