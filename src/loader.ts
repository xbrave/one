import { importEntry } from 'import-html-entry';
import { LifeCycles, ParcelConfigObject } from 'single-spa';
import { LoadableApp, Config } from './interface';

export async function getMicroApp<T extends object>(
  app: LoadableApp<T>,
  config: Config = {},
): Promise<ParcelConfigObject> {
  const { entry, name } = app;
  const appId = `${name}-${+ new Date()}-${Math.random().toString(36).slice(-6)}`;
  const { template, execScripts, assetPublicPath } = await importEntry(entry);
  
}