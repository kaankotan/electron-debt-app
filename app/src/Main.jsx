import React, { Component } from 'react'
import { render } from 'react-dom'
import Lottie from 'react-lottie'
import {} from './styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import * as appConstants from './Constants.jsx'
import * as animationData from './loader_spinner.json'
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
      isStopped: false,
      isPaused: false,
      isRequesting: true,
      debts: []
    }
    this.resize = this.resize.bind(this)
  }

  resize() {
    remote.getCurrentWindow().reload()
  }

  componentWillMount() {
    const Store = require('electron-store')
    const store = new Store()
    let _username = store.get('username')
    this.setState({ username: _username })
    var _this = this
    mongoClient.connect(DB_URI, function(err, db) {
      if(err) throw err
      db.db('data').collection('users').find({ 'username': _username })
      .toArray(function(err, results) {
        setTimeout(function() {
          _this.setState({ isRequesting: false })
        }, 2000)
        _this.setState({ debts: results[0].debts })
        console.log(results[0])
      })
    })

    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {
    const isRequesting = this.state.isRequesting
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData
    }
    return (
      (isRequesting ? 
        <Lottie options={defaultOptions}
          height={400}
          width={400}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused}/>
        :
        <div>
          <div className="hello">
            <h1>Kayıt olarak, kullanıcı kabul sözleşmemize uymuş oluyorsun.</h1>
          </div>
          <p>
            İstediğin platformda, hesapların seninle.
          </p>
          <br /><br />
        </div>
      )
    )
  }
}
