import { importEntry } from 'import-html-entry';
import { getMicroAppStateActions } from './global';
import { toArray, noop, validateExportLifecycle } from './utils';
import { ParcelConfigObject } from 'single-spa';
import { LoadableApp, LifeCycles, LifeCycleFn } from './interface';

const getTemplateWrapper = (id: string, name: string, template: string) => {
  return `<div id=${id} data-name=${name}>${template}</div>`;
};

function createElement(content: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = content;
  return div.firstChild as HTMLElement;
}

function execHooksChain<T extends object>(
  hooks: Array<LifeCycleFn<T>>,
  app: LoadableApp<T>,
  global = window
): Promise<any> {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app, global)), Promise.resolve());
  }
  return Promise.resolve();
}

function getLifecyclesFromExports(scriptExports: LifeCycles<any>, appName: string, global: WindowProxy) {
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  const globalVariableExports = (global as any)[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error(`You need to export lifecycle functions in ${appName} entry`);
}

export async function getMicroApp<T extends object>(
  app: LoadableApp<T>,
  lifeCycles: LifeCycles<T>
): Promise<ParcelConfigObject> {
  let global = window;
  const { entry, name } = app;
  const appId = `${name}_${+new Date()}_${Math.random().toString(36).slice(-6)}`;
  const { template, execScripts } = await importEntry(entry);
  const appContent = getTemplateWrapper(appId, name, template);
  let element: HTMLElement | null = createElement(appContent);
  const { beforeMount = noop, afterMount = noop, beforeUnmount = noop, afterUnmount = noop } = lifeCycles;
  const exports: any = await execScripts(global, true);
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(exports, name, global);
  const { onGlobalStateChange, offGlobalStateChange, setGlobalState } = getMicroAppStateActions(appId);
  const parcelConfig: ParcelConfigObject = {
    name: appId,
    bootstrap,
    mount: [
      async () => execHooksChain(toArray(beforeMount), app, global),
      async props => mount({ ...props, container: element, setGlobalState, onGlobalStateChange }),
      async () => execHooksChain(toArray(afterMount), app, global),
    ],
    unmount: [
      async () => execHooksChain(toArray(beforeUnmount), app, global),
      async props => unmount({ ...props, container: element }),
      async () => execHooksChain(toArray(afterUnmount), app, global),
      async () => {
        offGlobalStateChange();
        element = null;
      },
    ],
  };
  if (typeof update === 'function') {
    parcelConfig.update = update;
  }
  return parcelConfig;
}
