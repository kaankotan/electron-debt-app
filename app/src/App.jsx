import React, {Component} from 'react'
import {render} from 'react-dom'
import {} from './styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import * as appConstants from './Constants.jsx'
import Link from './components/Link.jsx'

import { Input } from 'semantic-ui-react'

export default class App extends Component {
  constructor() {
    super()
    this.resize = this.resize.bind(this)
  }

  resize() {
    this.forceUpdate()
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
          <h1>Veresiye Kontrol Uygulamasına Hoşgeldin!</h1>
        </div>
        <p>
          CENG316 Yazılım Mühendisliğine Giriş dersi için yapılmıştır.
        </p>
        <br /><br />
        <Input
          style={{ minWidth: appConstants.buttonWidth }}
          label={{ content: 'Kullanıcı adı' }}
          labelPosition='right'
        />
        <br />
        <Input
          style={{ minWidth: appConstants.buttonWidth,
            marginTop: appConstants.buttonMarginTop }}
          label={{ content: 'Şifre' }}
          labelPosition='right'
        />
      </div>
    )
  }
}
