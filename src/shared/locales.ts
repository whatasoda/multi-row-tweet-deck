interface MessageValue {
  message: string;
  description: string;
}

const createLocales = <K extends string>(descriptions: Record<K, string>) => {
  const messages = (input: Record<K, string>) => {
    const platform = (process.env.npm_lifecycle_event || ':').split(':')[1];
    if (platform === 'extension') {
      return (Object.entries(input) as [K, string][]).reduce((acc, [key, message]) => {
        const description = descriptions[key];
        acc[key] = { description, message };
        return acc;
      }, {} as Record<string, MessageValue>) as Record<K, MessageValue>;
    } else {
      return { ...input };
    }
  };

  const m = Object.keys(descriptions).reduce<Record<string, string>>((acc, key) => {
    acc[key] = `__MSG_${key}__`;
    return acc;
  }, {}) as Record<K, string>;

  return { messages, m };
};

export const locales = createLocales({
  description: 'a short description about the extension',
  about: 'a long description about the extension',
  installationMessage: 'a message to promote installing the extension',
  contact: 'a message about contact',
  dateRecentUse: 'a label for "dateRecentUse" sort rule',
  dateCreated: 'a label for "dateCreated" sort rule',
  dateUpdated: 'a label for "dateUpdated" sort rule',
  profileListDescription: 'a description for usage of profile list drawer',
  confirmOnSwitchProfile: 'a message on switch profile',
  confirmOnDeleteCurrentProfile: 'a message on delete current profile',
  alertOnCreateNewProfile: 'a message on create new profile',
  confirmOnCreateNewProfile: 'a message on create new profile',
  beforeUnload: 'a message on before unload',
});
