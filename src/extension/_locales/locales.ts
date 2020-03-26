interface MessageValue {
  message: string;
  description: string;
}

const createLocales = <K extends string>(descriptions: Record<K, string>) => {
  const messages = (input: Record<K, string>) => {
    return (Object.entries(input) as [K, string][]).reduce((acc, [key, message]) => {
      const description = descriptions[key];
      acc[key] = { description, message };
      return acc;
    }, {} as Record<string, MessageValue>) as Record<K, MessageValue>;
  };

  const m = Object.keys(descriptions).reduce<Record<string, string>>((acc, key) => {
    acc[key] = `__MSG_${key}__`;
    return acc;
  }, {}) as Record<K, string>;

  return { messages, m };
};

export const locales = createLocales({
  description: 'Extension Description',
});
