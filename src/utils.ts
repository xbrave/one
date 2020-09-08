export class Deferred<T> {
  promise: Promise<T>;
  resolve!: (value?: T | PromiseLike<T>) => void;
  reject!: (reason?: any) => void;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

type Target = Record<string, any>;

export function clone(target: Target): Target {
  const ret: Target = Array.isArray(target) ? [] : {};
  for (let i in target) {
    ret[i] = typeof target[i] === 'object' ? clone(target[i]) : target[i];
  }
  return ret;
}

export function toArray(target: any) {
  return Array.isArray(target) ? target : [target];
}
