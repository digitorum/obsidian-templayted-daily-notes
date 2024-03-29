const texts: Record<string, string> = {
  'ribbon:hint': 'Add new daily note',
  'settings-edit-ribbon-modal:folder-field-description-text': 'Folder absolute path (from vault root)',
  'settings-edit-ribbon-modal:folder-field-name': 'Folder',
  'settings-edit-ribbon-modal:hint-field-description-text': 'Hint for display on icon hover',
  'settings-edit-ribbon-modal:hint-field-name': 'Hint',
  'settings-edit-ribbon-modal:icon-field-description-html': 'Browse to <a href="https://lucide.dev">lucide.dev</a> to see all available icons and their corresponding names.',
  'settings-edit-ribbon-modal:icon-field-name': 'Icon',
  'settings-edit-ribbon-modal:submit': 'Submit',
  'settings-edit-ribbon-modal:template-field-description-text': 'Template file full name (with extention)',
  'settings-edit-ribbon-modal:template-field-name': 'Template',
  'settings-edit-ribbon-modal:title-create': 'Create ribbon',
  'settings-edit-ribbon-modal:title-edit': 'Edit "{{name}}" ribbon',
  'settings-tab:button-add': 'Add new rule',
  'settings-tab:button-delete': 'Delete',
  'settings-tab:button-edit': 'Edit',
  'settings-tab:description': 'To be able to create rules, you must specify a folder with templates. Please check your application settings before proceeding.',
  'settings-tab:ribbon-value': 'Ribbon icon "{{icon}}" with hint "{{hint}}" for create note in folder "{{folder}}" with template "{{template}}"',
  'settings-tab:title': 'Templated daily notes rules'
}

export class L18n {

  public get(slug: string, params: Record<string, string> = {}) {
    let str = texts[slug] ?? ''

    Object
      .keys(params)
      .forEach((param) => {
        str = str.replace(`{{${param}}}`, params[param])
      })

    return str

  }
}