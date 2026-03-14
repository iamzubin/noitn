import { DecoratorNode, LexicalNode, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'
import { WidgetComponent } from './WidgetComponent'

export type WidgetType = 'timer' | 'checkbox' | 'counter' | 'table' | 'placeholder'

export interface WidgetConfig {
  type: WidgetType
  data: Record<string, unknown>
}

export interface SerializedWidgetNode extends SerializedLexicalNode {
  type: 'widget'
  widgetConfig: WidgetConfig
}

export class WidgetNode extends DecoratorNode<ReactNode> {
  private _widgetConfig: WidgetConfig

  constructor(widgetConfig: WidgetConfig, key?: string) {
    super(key)
    this._widgetConfig = widgetConfig
  }

  static getType(): string {
    return 'widget'
  }

  static clone(node: WidgetNode): WidgetNode {
    return new WidgetNode({ ...node._widgetConfig }, node.__key)
  }

  static importJSON(serialized: SerializedWidgetNode): WidgetNode {
    return new WidgetNode(serialized.widgetConfig)
  }

  getWidgetConfig(): WidgetConfig {
    return this._widgetConfig
  }

  setWidgetConfig(config: WidgetConfig): void {
    const self = this.getWritable()
    self._widgetConfig = config
  }

  createDOM(): HTMLElement {
    return document.createElement('div')
  }

  updateDOM(): false {
    return false
  }

  decorate(): ReactNode {
    return (
      <WidgetComponent 
        config={this._widgetConfig} 
        onConfigChange={(config: WidgetConfig) => {
          this.setWidgetConfig(config)
        }}
      />
    )
  }

  exportJSON(): SerializedWidgetNode {
    return {
      ...super.exportJSON(),
      type: 'widget',
      widgetConfig: this._widgetConfig,
    }
  }
}

export function $createWidgetNode(widgetConfig: WidgetConfig): WidgetNode {
  return new WidgetNode(widgetConfig)
}

export function $isWidgetNode(node: LexicalNode | null | undefined): boolean {
  return node instanceof WidgetNode
}