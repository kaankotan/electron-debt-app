/*
 * Coypright (c) 2018, Orhan Istenhickorkmaz & Kaan Kotan
 * This app is for CENG 316 lecture.
 * Free to use it anywhere.
 *
 * 1 tab == 2 spaces!
 *
 */

import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'

import App from './App.jsx'
import Register from './Register.jsx'

render(
  <HashRouter>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path="/register" component={Register} />
    </div>
  </HashRouter>,
  document.getElementById('app')
)
