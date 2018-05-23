import React from 'react';
import ReactDOM from 'react-dom';

const title = "hi there";
const tracks = [
  {
    title: 'Some track',
  },
  {
    title: 'Some other track'
  }
];

ReactDOM.render(<div>{title}</div>, document.getElementById('app'));

module.hot.accept();