import { RegisterApplicationConfig, StartOpts } from 'single-spa';

export type Entry = string;

export type AppMetaData = {
  name: string;
  entry: Entry;
};

export type RegisterableApplication<T extends object = {}> = AppMetaData & {
  container: string | HTMLElement;
  activeWhen: RegisterApplicationConfig['activeWhen'];
  loader?: (loading: boolean) => void;
  props?: T;
};

type StartMetaOptions  = {
  prefetch?: boolean //TODO: 这里暂时默认开启,之后考虑自定义相关的预加载方案
}

export type Config = StartMetaOptions & StartOpts;