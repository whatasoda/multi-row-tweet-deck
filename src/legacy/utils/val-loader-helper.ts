const ValLoaderCode = (gen: () => object | Promise<object>) => async () => ({
  code: JSON.stringify(await gen()),
});

export default ValLoaderCode;
