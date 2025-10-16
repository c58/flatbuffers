import { Builder } from "./builder";
import { Offset } from "./types";

export const createObjectProxy = <T extends object>(
  resolveField: (prop: string | symbol) => unknown,
  pack: (builder: Builder) => Offset,
): T => {
  const cache = {} as any;

  const proxy = new Proxy<T>(cache as any, {
    get(target, prop) {
      if (prop in cache) return cache[prop];
      const value = resolveField(prop);
      return cache[prop] = value;
    }
  })

  cache.pack = pack.bind(proxy);
  cache.field = resolveField;

  return proxy;
}
