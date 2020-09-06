import { registerApplication, start as startApplication } from 'single-spa';
import { RegisterableApplication, Config } from './interface';

function noop(): void {}

let microApps: RegisterableApplication[] = [];
let config: Config = {};

export function register<T extends object = {}>(apps: RegisterableApplication<T>[]) {
  const unregisterApps = apps.filter(app => !microApps.some(registerApp => registerApp.name === app.name));
  microApps = [...microApps, ...unregisterApps];
  unregisterApps.forEach(app => {
    const { name, activeWhen, loader = noop, props, ...remainingConfig } = app;
    registerApplication({
      name,
      app: async () => {},
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
