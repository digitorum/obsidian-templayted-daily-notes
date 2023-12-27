import {
  Modal,
  Plugin,
  Setting
} from "obsidian"

import { NsSettings } from './settings-value-object'

import { L18n } from './l18n'
import { VaultValueObject } from './vault-value-object'

export class SettingsEditRibbonModal extends Modal {

  private l18n: L18n
  private vaultvo: VaultValueObject
  private model: NsSettings.IRibbonValue
  private onSubmitActions: ((ribbon: NsSettings.IRibbonValue) => Promise<void>) | null = null

  constructor(
    plugin: Plugin,
    model: NsSettings.IRibbonValue
  ) {
    super(plugin.app)

    this.l18n = new L18n()
    this.model = Object.assign({}, model)
    this.vaultvo = new VaultValueObject(plugin.app.vault)

    this.titleEl.innerText = this.model.hint
      ? this.l18n.get('settings-edit-ribbon-modal:title-edit', { name: this.model.hint })
      : this.l18n.get('settings-edit-ribbon-modal:title-create')
  }

  private async initIconField(content: HTMLElement) {

    const setting = new Setting(content)
      .setName(this.l18n.get('settings-edit-ribbon-modal:icon-field-name'))
      .addText((text) => {
          text
            .setValue(this.model.icon)
            .onChange((v) => {
              this.model.icon = v
            })
      })
      .setDisabled(false)

    setting.descEl.innerHTML = this.l18n.get('settings-edit-ribbon-modal:icon-field-description-html')
  }

  private async initHintField(content: HTMLElement) {
    new Setting(content)
      .setName(this.l18n.get('settings-edit-ribbon-modal:hint-field-name'))
      .setDesc(this.l18n.get('settings-edit-ribbon-modal:hint-field-description-text'))
      .addText((text) => {
          text
            .setValue(this.model.hint)
            .onChange((v) => {
              this.model.hint = v
            })
      })
      .setDisabled(false)
  }

  private async initFolderField(content: HTMLElement) {
    const folders = (await this.vaultvo.loadDirectoryList()).toMap()

    new Setting(content)
      .setName(this.l18n.get('settings-edit-ribbon-modal:folder-field-name'))
      .setDesc(this.l18n.get('settings-edit-ribbon-modal:folder-field-description-text'))
      .addDropdown((dd) => {
        dd
          .addOptions(folders)
          .setValue(this.model.folder)
          .onChange((v) => {
            this.model.folder = v
          })
      })
      .setDisabled(false)
  }

  private async initTemplateField(content: HTMLElement) {
    const templates = (await this.vaultvo.loadTemplatesList()).toMap()

    new Setting(content)
      .setName(this.l18n.get('settings-edit-ribbon-modal:template-field-name'))
      .setDesc(this.l18n.get('settings-edit-ribbon-modal:template-field-description-text'))
      .addDropdown((dd) => {
        dd
          .addOptions(templates)
          .setValue(this.model.template)
          .onChange((v) => {
            this.model.template = v
          })
      })
      .setDisabled(false)
  }

  async display() {
    const root = this.contentEl

    root.empty()

    const content = root.createDiv()

    await this.initIconField(content)
    await this.initHintField(content)
    await this.initTemplateField(content)
    await this.initFolderField(content)

    new Setting(content)
      .addButton((button) => {
        return button
          .setButtonText(this.l18n.get('settings-edit-ribbon-modal:submit'))
          .setCta()
          .onClick(() => {
            this.onSubmitActions?.(this.model)
            this.close()
          })
      })
  }

  onOpen() {
    this.display()
  }

  onSubmit(fn: (ribbon: NsSettings.IRibbonValue) =>  Promise<void>) {
    this.onSubmitActions = fn

    return this
  }
}