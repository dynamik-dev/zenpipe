type ZenTransformer<T = any> = (() => Promise<T>) | (() => T);

const myCoolFunction = async (x: number) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return x * 2;
}

const zen = async (input: any, transformers: ZenTransformer[]) => {
    return Object.assign({}, await Promise.allSettled(transformers.map(async (transformer) => transformer(input))));
}