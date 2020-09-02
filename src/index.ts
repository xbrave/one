import { mountRootParcel, registerApplication, start as startApplication } from 'single-spa';

export const register = () => {
  registerApplication()
}

export const load = () => {

}

export const start = () => {
  startApplication();
}
