import { register, start } from '../../es';
import load from './load';
import './index.less';

load(true);

const loader = bool => load(bool);

const container = '#app'

register(
  [
   {
    name: 'react',
    entry: 'http://localhost:2334',
    container,
    loader,
    activeWhen: '/react'
   },
   {
    name: 'vue',
    entry: 'http://localhost:2335',
    container,
    loader,
    activeWhen: '/vue'
   },
  ],
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      },
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      },
    ],
  },
)

start();