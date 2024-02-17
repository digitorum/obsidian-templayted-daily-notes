import {
  App,
  Menu,
  Plugin,
  PluginManifest
} from "obsidian"

import { L18n } from './classes/l18n'
import { SettingsTab } from './classes/settings-tab'
import { SettingsValueObject } from './classes/settings-value-object'
import { VaultValueObject } from './classes/vault-value-object'

export default class TemplatedDailyNotesPlugin extends Plugin {

  private settings: SettingsValueObject
  private vaultvo: VaultValueObject
  private l18n: L18n

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest)

    this.settings = new SettingsValueObject(this)
    this.vaultvo = new VaultValueObject(app.vault)
    this.l18n = new L18n()
  }

  private async createTodayFile(templatePath: string, folder: string) {
    if (!folder) {
      return
    }

    const path = `${folder}/${window.moment().format('YYYY-MM-DD')}.md`
    const result = await this.vaultvo.createTemplatedFile(path, templatePath)

    if (result) {
      this.app.workspace.getLeaf().openFile(result)
    }
  }

  async onload() {
    await this.settings.load()

    this.addRibbonIcon('list-plus', this.l18n.get('ribbon:hint'), async (event) => {
      const menu = new Menu()

      this.settings.ribbons.forEach((ribbon) => {
        menu.addItem((item) => {
          return item
            .setTitle(ribbon.hint)
            .setIcon(ribbon.icon)
            .onClick(() => {
              this.createTodayFile(ribbon.template, ribbon.folder)
            })
        })
      })

      menu.showAtMouseEvent(event)
    })

    this.addSettingTab(new SettingsTab(this.app, this, this.settings))
  }
}
