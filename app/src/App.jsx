import React, { Component } from 'react'
import { render } from 'react-dom'
import {} from './styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import * as appConstants from './Constants.jsx'
import Link from './components/Link.jsx'
import { remote } from 'electron'

import { Input, Button, Divider, Header,
  Icon, Label } from 'semantic-ui-react'

var mongoClient = require('mongodb').MongoClient
const DB_URI = 'mongodb://orhaneee:trizmir3@cluster-0-shard-00-00-5hq5j.mongodb.net:27017,cluster-0-shard-00-01-5hq5j.mongodb.net:27017,cluster-0-shard-00-02-5hq5j.mongodb.net:27017/data?ssl=true&replicaSet=cluster-0-shard-0&authSource=admin'

export default class App extends Component {

  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      open: false,
      message: ''
    }
    this.resize = this.resize.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })

  handleRegister() {
    this.props.history.push('/register')
  }

  handleStart() {
    /* Should start app with login */
    var _this = this
    mongoClient.connect(DB_URI, function(err, db) {
      if(err) throw err
      db.db('data').collection('users').find({ 'username': _this.state.username })
      .toArray(function(err, results) {
        if(results.length === 0) {
          _this.setState({ open: true })
          _this.setState({ message: 'Kullanıcı bulunamadı :(' })
        }
        else {
          _this.props.history.push('/main')
        }
      })
      db.close()
    })
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
    const { open, size } = this.state
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
          onChange={(event, data) => this.setState({ username: event.target.value })}
          label={{ content: 'Kullanıcı adı' }}
          labelPosition='right'
        />
        <br />
        <Input
          style={{ minWidth: appConstants.buttonWidth,
            marginTop: appConstants.buttonMarginTop }}
          onChange={(event, data) => this.setState({ password: event.target.value })}
          type='password'
          label={{ content: 'Şifre' }}
          labelPosition='right'
        />
        <br /><br /><br />
        {this.state.open ? <p style={{ fontSize: appConstants.smallFontSize }}>{this.state.message}</p> :
        <Button inverted color='green' onClick={this.handleStart}>Başla!</Button>}
        <Divider />
        <Label as='a' color='teal' size='large' tag onClick={this.handleRegister}>Kayıt ol!</Label>

      </div>
    )
  }
}
