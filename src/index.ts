import { registerApplication, start as startApplication } from 'single-spa';
import { Deferred, toArray } from './utils';
import { getMicroApp } from './loader';
import { RegisterableApplication, Config, LifeCycles } from './interface';

function noop(): void {}

let microApps: RegisterableApplication[] = [];
let config: Config = {};
const startDefer = new Deferred<void>();

export function register<T extends object = {}>(apps: RegisterableApplication<T>[], lifeCycles: LifeCycles<T>) {
  const unregisterApps = apps.filter(app => !microApps.some(registerApp => registerApp.name === app.name));
  microApps = [...microApps, ...unregisterApps];
  unregisterApps.forEach(app => {
    const { name, activeWhen, loader = noop, props, ...remainingConfig } = app;
    registerApplication({
      name,
      app: async () => {
        loader(true);
        await startDefer.promise;
        const { mount, ...otherConfig } = await getMicroApp({ name, props, ...remainingConfig }, lifeCycles);
        return {
          mount: [async () => loader(true), ...toArray(mount), async () => loader(false)],
          ...otherConfig
        };
      },
      activeWhen,
      customProps: props,
    });
  });
}

export const load = () => {};

export const start = (options: Config) => {
  config = { ...config, ...options };
  const { urlRerouteOnly } = config;
  startApplication({ urlRerouteOnly });
};
