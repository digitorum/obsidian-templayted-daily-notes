import {
  App,
  Plugin,
  PluginSettingTab,
  Setting
} from "obsidian"

import { L18n } from './l18n'
import { SettingsValueObject } from './settings-value-object'
import { SettingsEditRibbonModal } from './settings-edit-ribbon-modal'

export class SettingsTab extends PluginSettingTab {
  private l18n: L18n

  constructor(
    app: App,
    private plugin: Plugin,
    private settingsvo: SettingsValueObject
  ) {
    super(app, plugin)

    this.l18n = new L18n()
  }

  display(): void {
    const root = this.containerEl
    const settings = this.settingsvo

    root.empty()

    root.createEl('p', { text: this.l18n.get('settings-tab:description') })

    root.createEl('h3', { text: this.l18n.get('settings-tab:title') })

    settings
      .ribbons
      .forEach((value) => {
        const setting = new Setting(root)

        setting
          .infoEl
          .innerHTML = this.l18n.get('settings-tab:ribbon-value-html', {
            icon: value.icon,
            hint: value.hint,
            folder: value.folder,
            template: value.template || '-'
          })

        setting
          .addExtraButton((button) => {
            button
              .setIcon('cross')
              .setTooltip(this.l18n.get('settings-tab:button-delete'))
              .onClick(async () => {
                await settings.deleteRibbonById(value.id)
                this.display()
              })
          })
          .addExtraButton((button) => {
            button
              .setIcon('pencil')
              .setTooltip(this.l18n.get('settings-tab:button-edit'))
              .onClick(async () => {
                new SettingsEditRibbonModal(this.plugin, value)
                  .onSubmit(async (ribbon) => {
                    await settings.replaceRibbon(ribbon)
                    this.display()
                  })
                  .open()
              })
            })
      })

    new Setting(root)
      .addButton((button) => {
        return button
          .setButtonText(this.l18n.get('settings-tab:button-add'))
          .setCta()
          .onClick(() => {
            new SettingsEditRibbonModal(
              this.plugin, {
                id: new Date().getTime().toString(),
                icon: '',
                hint: '',
                template: '',
                folder: ''
              })
              .onSubmit(async (ribbon) => {
                await settings.addRibbon(ribbon)
                this.display()
              })
              .open()
          })
      })
  }
}
