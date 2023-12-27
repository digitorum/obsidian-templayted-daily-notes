import {
  TFile,
  Vault
} from 'obsidian'

export class VaultValueObjectArray {
  private value: string[]

  constructor() {
    this.value = []
  }

  public get state(): Readonly<string[]> {
    return this.value
  }

  public concat(arr: string[] | VaultValueObjectArray) {
    if (Array.isArray(arr)) {
      this.value = this.value.concat(arr)
    } else {
      this.value = this.value.concat(arr.state)
    }

    return this
  }

  public toMap(): Record<string, string> {
    return this.value
      .reduce<Record<string, string>>((acc, node) => {
        acc[node] = node

        return acc
      }, {})
  }
}

export class VaultValueObject {

  constructor(
    private vault: Vault
  ) {

  }

  public async readFile(path: string): Promise<string> {
    try {
      const file = this.vault.getAbstractFileByPath(path)

      if (!file) {
        return ''
      }

      if (!(file instanceof TFile)) {
        return ''
      }

      return await this.vault.read(file) ?? null
    } catch {
      return ''
    }
  }

  public async createTemplatedFile(path: string, templatePath: string): Promise<TFile | null> {
    const result = this.vault.getAbstractFileByPath(path)

    if (!result) {
      const templateContent = await this.readFile(templatePath)
      const file = await this.vault.create(path, templateContent)

      return file
    } else if (result instanceof TFile) {
      return result
    }

    return null
  }

  public async loadTemplatesList(): Promise<VaultValueObjectArray> {
    const result = new VaultValueObjectArray()

    try {
      const settings = JSON.parse(await this.vault.adapter.read(`${this.vault.configDir}/templates.json`))

      if (!settings.folder) {
        return result
      }

      result.concat((await this.vault.adapter.list(settings.folder))?.files)
    } catch {
      // do nothing
    }

    return result
  }

  public async loadDirectoryList(root: string = '/'): Promise<VaultValueObjectArray> {
    const result = new VaultValueObjectArray()

    try {

      const list = (await this.vault.adapter.list(root))
        .folders
        .filter((name) => name !== this.vault.configDir)

      result.concat(list)

      for(let i = 0; i < list.length; ++i) {
        const subfolders = await this.loadDirectoryList(list[i])

        result.concat(subfolders)
      }

    } catch {
      // do nothing
    }

    return result
  }

}