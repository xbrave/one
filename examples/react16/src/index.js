import './public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function render(props) {
  ReactDOM.render(<App />, document.querySelector('#app'));
}

function storeTest(props) {
  props.onGlobalStateChange((value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
  props.setGlobalState({
    ignore: props.name,
    user: {
      name: props.name,
    },
  });
}

if (!window.__ONE__) {
  render();
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props) {
  console.log('[react16] props from main framework', props);
  storeTest(props);
  render(props);
}

export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(document.querySelector('#app'));
}