'use client'

import { useState, useEffect } from 'react'
import { WidgetConfig, WidgetType } from './WidgetNode'
import { widgetTypes, getWidgetDefinition } from './registry'
import { WidgetComponent } from './WidgetComponent'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface WidgetDesignerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: WidgetConfig | null
  onSave: (config: WidgetConfig) => void
}

export function WidgetDesigner({ open, onOpenChange, config, onSave }: WidgetDesignerProps) {
  const [localConfig, setLocalConfig] = useState<WidgetConfig | null>(config)

  useEffect(() => {
    setLocalConfig(config)
  }, [config])

  if (!localConfig) return null

  const definition = getWidgetDefinition(localConfig.type)

  const handleSave = () => {
    if (localConfig) {
      onSave(localConfig)
      onOpenChange(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Widget Designer</DrawerTitle>
          <DrawerDescription>Configure your widget properties</DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Widget Type</Label>
            <Select
              value={localConfig.type}
              onValueChange={(value) => {
                if (!value) return
                const newDef = getWidgetDefinition(value as WidgetType)
                const newData: Record<string, unknown> = {}
                newDef.fields.forEach((field) => {
                  newData[field.name] = field.defaultValue
                })
                setLocalConfig({ type: value as WidgetType, data: newData })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {widgetTypes.map((type) => {
                  const def = getWidgetDefinition(type)
                  return (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {def.icon}
                        <span>{def.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-muted-foreground">Properties</Label>
            {definition.fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <Label className="text-sm">{field.label}</Label>
                {field.type === 'text' && (
                  <Input
                    value={String(localConfig.data[field.name] ?? '')}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        data: { ...localConfig.data, [field.name]: e.target.value },
                      })
                    }
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    value={String(localConfig.data[field.name] ?? 0)}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        data: { ...localConfig.data, [field.name]: Number(e.target.value) },
                      })
                    }
                  />
                )}
                {field.type === 'boolean' && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={Boolean(localConfig.data[field.name])}
                      onCheckedChange={(checked) =>
                        setLocalConfig({
                          ...localConfig,
                          data: { ...localConfig.data, [field.name]: checked },
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {localConfig.data[field.name] ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-muted-foreground">Preview</Label>
            <div className="flex justify-center p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <WidgetComponent
                config={localConfig}
                onConfigChange={(newConfig) => setLocalConfig(newConfig)}
              />
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSave}>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}