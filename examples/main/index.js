import { register, start } from '../../es';
import './index.less';

const container = '#app'

register(
  [
   {
    name: 'react16',
    entry: 'http://localhost:2334',
    container,
    activeWhen: '/react16'
   },
   {
    name: 'vue',
    entry: 'http://localhost:2335',
    container,
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