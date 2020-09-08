import { importEntry } from 'import-html-entry';
import { getMicroAppStateActions } from './global';
import { toArray } from './utils';
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

export async function getMicroApp<T extends object>(
  app: LoadableApp<T>,
  lifeCycles: LifeCycles<T>
) {
  let global = window;
  const { entry, name } = app;
  const appId = `${name}-${+new Date()}-${Math.random().toString(36).slice(-6)}`;
  const { template, execScripts } = await importEntry(entry);
  const appContent = getTemplateWrapper(appId, name, template);
  let element: HTMLElement | null = createElement(appContent);
  const { beforeMount, afterMount, beforeUnmount, afterUnmount } = lifeCycles;
  const { bootstrap, mount, unmount, update } = await execScripts(global);
  const { onGlobalStateChange, offGlobalStateChange, setGlobalState } = getMicroAppStateActions(appId);
  console.log(element);
  const parcelConfig: ParcelConfigObject = {
    name: appId,
    bootstrap,
    mount: [
      async () => execHooksChain(toArray(beforeMount), app, global),
      async props => mount({ ...props, setGlobalState, onGlobalStateChange }),
      async () => execHooksChain(toArray(afterMount), app, global),
    ],
    unmount: [
      async () => execHooksChain(toArray(beforeUnmount), app, global),
      async props => unmount(props),
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
