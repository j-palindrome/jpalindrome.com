import {
  App,
  MarkdownFileInfo,
  MarkdownView,
  Menu,
  Notice,
  Plugin,
  setIcon,
} from 'obsidian'
import SettingsTab from './plugin/SettingsTab'
import { createRoot } from 'react-dom/client'
import AsemicApp from './components/AsemicApp'

// comment
export default class AsemicPlugin extends Plugin {
  settings: {} = {}

  constructor(app: App, manifest: any) {
    super(app, manifest)
    this.saveSettings = this.saveSettings.bind(this)
  }

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new SettingsTab(this))

    this.registerMarkdownCodeBlockProcessor('asemic', (source, el, ctx) => {
      const root = createRoot(el)

      root.render(<AsemicApp source={source} />)
    })
    // this.registerView(TIME_RULER_VIEW, (leaf) => new TimeRulerView(leaf, this))
  }

  async loadSettings() {
    Object.assign(this.settings, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
