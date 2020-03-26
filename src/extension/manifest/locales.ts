interface MessageValue {
  message: string;
  description: string;
}

const createLocales = <K extends string>(descriptions: Record<K, string>) => {
  const createMessages = (messages: Record<K, string>) => {
    const result = (Object.entries(messages) as [K, string][]).reduce((acc, [key, message]) => {
      const description = descriptions[key];
      acc[key] = { description, message };
      return acc;
    }, {} as Record<string, MessageValue>);
    return { code: JSON.stringify(result) };
  };

  const m = Object.keys(descriptions).reduce<Record<string, string>>((acc, key) => {
    acc[key] = `__MSG_${key}__`;
    return acc;
  }, {}) as Record<K, string>;

  return { createMessages, m };
};

export const locales = createLocales({
  description: 'Extension Description',
});
