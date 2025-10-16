import { Builder } from "./builder";
import { Offset } from "./types";

export const createObjectProxy = <T extends object>(
  resolveField: (prop: string | symbol) => unknown,
  pack: (builder: Builder) => Offset,
): T => {
  const cache = new Map<string | symbol, unknown>();

  const proxy = new Proxy<T>({} as any, {
    get(target, prop) {
      if (cache.has(prop)) {
        return cache.get(prop);
      }
      const value = resolveField(prop);
      cache.set(prop, value);
      return value;
    },
    set(target, prop, value) {
      cache.set(prop, value);
      return true;
    }
  })

  cache.set('pack', pack.bind(proxy));
  cache.set('field', resolveField);
  return proxy;
}
