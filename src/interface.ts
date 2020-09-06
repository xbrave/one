import { RegisterApplicationConfig, StartOpts } from 'single-spa';

export type Entry = string;

export type AppMetaData = {
  name: string;
  entry: Entry;
};

export type LoadableApp<T extends object = {}> = AppMetaData & { props?: T } & {
  container: string | HTMLElement
}

export type RegisterableApplication<T extends object = {}> = AppMetaData & LoadableApp<T> & {
  activeWhen: RegisterApplicationConfig['activeWhen'];
  loader?: (loading: boolean) => void;
};

type StartMetaOptions  = {
  prefetch?: boolean //TODO: 这里暂时默认开启,之后考虑自定义相关的预加载方案
}

export type Config = StartMetaOptions & StartOpts;