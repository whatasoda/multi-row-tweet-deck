const hello = () => ({ hello: 'world' });

const code = (gen: () => object | Promise<object>) =>
  async () => ({
    code: JSON.stringify(await gen()),
  });

export = code(hello);
