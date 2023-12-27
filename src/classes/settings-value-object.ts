import {
  Plugin
} from "obsidian"

export namespace NsSettings {

  export interface IRibbonValue {
    id: string;
    icon: string;
    hint: string;
    template: string;
    folder: string;
  }

  export interface IValue {
    ribbons: IRibbonValue[];
  }

}

export class SettingsValueObject {

  private value: NsSettings.IValue | null

  constructor(
    private plugin: Plugin
  ) {
    this.value = null
  }

  public get ribbons(): NsSettings.IRibbonValue[] {
    return this.value?.ribbons ?? []
  }

  public async load() {
    this.value = Object.assign({}, {
      ribbons: []
    }, await this.plugin.loadData())
  }

  public async deleteRibbonById(id: string) {
    if (!this.value?.ribbons) {
      return
    }

    this.value.ribbons = this.value.ribbons
      .filter((ribbon) => ribbon.id !== id)

    await this.plugin.saveData(this.value)
  }

  public async replaceRibbon(value: NsSettings.IRibbonValue) {
    if (!this.value?.ribbons) {
      return
    }

    this.value.ribbons = this.value.ribbons
      .map((ribbon) => {
        if (ribbon.id !== value.id) {
          return ribbon
        }

        return value
      })

    await this.plugin.saveData(this.value)
  }

  public async addRibbon(value: NsSettings.IRibbonValue) {
    if (!this.value?.ribbons) {
      return
    }

    this.value.ribbons = [
      ...this.value.ribbons,
      value
    ]

    await this.plugin.saveData(this.value)
  }
}
