import React from 'react';
import ReactDOM from 'react-dom';

function App(props) {
  return (
    <>
      {props.isLoading && 'App is Loading'}
      <div id="app"></div>
    </>
  );
}

export default function load(isLoading) {
  ReactDOM.render(<App isLoading={isLoading} />, document.getElementById('app-container'));
}

