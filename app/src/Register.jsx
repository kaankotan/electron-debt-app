import React, { Component } from 'react'
import { render } from 'react-dom'
import {} from './styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import * as appConstants from './Constants.jsx'
import Link from './components/Link.jsx'
import { remote } from 'electron'

import { Input, Button } from 'semantic-ui-react'

var mongoClient = require('mongodb').MongoClient
const DB_URI = 'mongodb://orhaneee:trizmir3@cluster-0-shard-00-00-5hq5j.mongodb.net:27017,cluster-0-shard-00-01-5hq5j.mongodb.net:27017,cluster-0-shard-00-02-5hq5j.mongodb.net:27017/data?ssl=true&replicaSet=cluster-0-shard-0&authSource=admin'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      email: ''
    }
    this.resize = this.resize.bind(this)
    this.addUser = this.addUser.bind(this)
  }
  
  addUser() {
    /* Handling register */
    var _this = this
    mongoClient.connect(DB_URI, function(err, db) {
      if(err) throw err
      let userObject = { username: _this.state.username, password: _this.state.password,
        email: _this.state.email, debts: [] }
      db.db('data').collection('users').insertOne(userObject, function(err, res) {
        if(err) throw err
        db.close()
        if(_this.state.username.length !== 0 && _this.state.password.length !== 0) {
          const Store = require('electron-store')
          const store = new Store()
          store.set('username', _this.state.username)
          _this.props.history.push('/main')
        }
      })
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
