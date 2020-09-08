/**
 * @description: 发布订阅模式下的全局状态管理
 * TODO: 使用Rxjs等其他状态管理库替换
 * @author: Created by 星野 on 2020-09-08 11:26:22
 */

import { clone } from './utils';
import { OnGlobalStateChangeCallback, MicroAppStateActions } from './interface';

let globalState: Record<string, any> = {};

const deps: Record<string, OnGlobalStateChangeCallback> = {};

function emitGlobal(state: Record<string, any>, prevState: Record<string, any>) {
  Object.keys(deps).forEach((id: string) => {
    if (deps[id] instanceof Function) {
      deps[id](clone(state), clone(prevState));
    }
  });
}

export function initGlobalState(state: Record<string, any> = {}) {
  if (state === globalState) {
    console.warn('global state has not changed！');
  } else {
    const prevGlobalState = clone(globalState);
    globalState = clone(state);
    emitGlobal(globalState, prevGlobalState);
  }
  return getMicroAppStateActions(`global-${+new Date()}`, true);
}

export function getMicroAppStateActions(id: string, isMaster?: boolean): MicroAppStateActions {
  return {
    /**
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) {
      if (!(callback instanceof Function)) {
        console.error('onGlobalStataChange callback must be function!');
        return;
      }
      if (deps[id]) {
        console.warn(`'${id}' global listener already exists before this, new listener will overwrite it.`);
      }
      deps[id] = callback;
      const cloneState = clone(globalState);
      if (fireImmediately) {
        callback(cloneState, cloneState);
      }
    },

    /**
     * setGlobalState 更新store数据 并触发全局监听事件
     * @param state
     */
    setGlobalState(state: Record<string, any> = {}) {
      if (state === globalState) {
        console.warn('state has not changed！');
        return false;
      }

      const changeKeys: string[] = [];
      const prevGlobalState = clone(globalState);
      globalState = clone(
        Object.keys(state).reduce((_globalState, changeKey) => {
          if (isMaster || _globalState.hasOwnProperty(changeKey)) {
            changeKeys.push(changeKey);
            return Object.assign(_globalState, { [changeKey]: state[changeKey] });
          }
          console.warn(`'${changeKey}' not declared when init state！`);
          return _globalState;
        }, globalState)
      );
      if (changeKeys.length === 0) {
        console.warn('state has not changed！');
        return false;
      }
      emitGlobal(globalState, prevGlobalState);
      return true;
    },

    // 
    offGlobalStateChange() {
      delete deps[id];
      return true;
    },
  };
}
