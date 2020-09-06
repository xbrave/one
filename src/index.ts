import { registerApplication, start as startApplication } from 'single-spa';
import { Deferred } from './utils';
import { getMicroApp } from './loader';
import { RegisterableApplication, Config } from './interface';

function noop(): void {}

let microApps: RegisterableApplication[] = [];
let config: Config = {};
const startDefer = new Deferred<void>();

export function register<T extends object = {}>(apps: RegisterableApplication<T>[]) {
  const unregisterApps = apps.filter(app => !microApps.some(registerApp => registerApp.name === app.name));
  microApps = [...microApps, ...unregisterApps];
  unregisterApps.forEach(app => {
    const { name, activeWhen, loader = noop, props, ...remainingConfig } = app;
    registerApplication({
      name,
      app: async () => {
        loader(true);
        await startDefer.promise;
        const {} = await getMicroApp({ name, props, ...remainingConfig }, config);
        return {
          mount: [async () => loader(true), async () => loader(false)],
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
