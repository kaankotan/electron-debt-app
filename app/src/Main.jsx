import React, { Component } from 'react'
import { render } from 'react-dom'
import {} from './styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import * as appConstants from './Constants.jsx'
import Link from './components/Link.jsx'
import { remote } from 'electron'

import { Input, Button } from 'semantic-ui-react'

export default class App extends Component {
  constructor() {
    super()
    this.resize = this.resize.bind(this)
  }

  resize() {
    remote.getCurrentWindow().reload()
  }

  componentWillMount() {
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {
    return (
      <div>
        <div className="hello">
          <h1>Kayıt olarak, kullanıcı kabul sözleşmemize uymuş oluyorsun.</h1>
        </div>
        <p>
          İstediğin platformda, hesapların seninle.
        </p>
        <br /><br />
        <Input
          style={{ minWidth: appConstants.buttonWidth }}
          label={{ content: 'Kullanıcı adı' }}
          onChange={(event, data) => this.setState({ username: event.target.value })}
          labelPosition='right'
        />
        <br />
        <Input
          style={{ minWidth: appConstants.buttonWidth,
            marginTop: appConstants.buttonMarginTop }}
          type='password'
          label={{ content: 'Şifre' }}
          onChange={(event, data) => this.setState({ password: event.target.value })}
          labelPosition='right'
        />
        <br />
        <Input
          style={{ minWidth: appConstants.buttonWidth,
            marginTop: appConstants.buttonMarginTop }}
          label={{ content: 'E-mail' }}
          onChange={(event, data) => this.setState({ email: event.target.value })}
          labelPosition='right'
        />
        <br /><br /><br />
        <Button inverted color='green' onClick={this.addUser}>Kayıt ol!</Button>
      </div>
    )
  }
}
