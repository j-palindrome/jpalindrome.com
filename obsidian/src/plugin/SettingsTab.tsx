import _ from 'lodash'
import {
  Notice,
  PluginSettingTab,
  Setting,
  TextComponent,
  ValueComponent,
  request,
  setIcon,
} from 'obsidian'
import { useEffect, useRef } from 'react'
import { Root, createRoot } from 'react-dom/client'
import AsemicPlugin from '../main'

export default class SettingsTab extends PluginSettingTab {
  plugin: AsemicPlugin
  searcher: ValueComponent<string>
  calendarDisplay: HTMLDivElement
  names: Record<string, string>
  root: Root

  constructor(plugin: AsemicPlugin) {
    super(plugin.app, plugin)
    this.plugin = plugin
    this.names = {}
  }

  async display() {
    let { containerEl } = this
    containerEl.empty()

    // render settings
  }
}
