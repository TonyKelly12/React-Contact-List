import css from './scss/app.scss';

import React from 'react';
import ReactDom from 'react-dom';
import App from './js/App';

//polyfill to make fetchAPI work in all browser
require('es6-promise').polyfill();
require('isomorphic-fetch');
ReactDom.render(<App />, document.getElementById('root'));