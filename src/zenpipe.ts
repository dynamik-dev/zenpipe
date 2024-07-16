type AnyFunc = (...args: any[]) => any;

interface ZenPipeOptions {
  runAsync?: boolean;
}

export function zenpipe<I, O>(
  fns: AnyFunc[],
  options: ZenPipeOptions = {}
): (input: I) => Promise<O> {
  const { runAsync = false } = options;

  return async (input: I): Promise<O> => {
    if (runAsync) {
      let result: any = input;
      for (const fn of fns) {
        result = await fn(result);
      }
      return result as O;
    } else {
      let result: any = input;
      const asyncFns: AnyFunc[] = [];
      
      for (const fn of fns) {
        if (fn.constructor.name === 'AsyncFunction') {
          asyncFns.push(fn);
        } else {
          result = fn(result);
        }
      }
      
      if (asyncFns.length > 0) {
        result = await asyncFns.reduce(async (acc, fn) => fn(await acc), Promise.resolve(result));
      }
      
      return result as O;
    }
  };
}