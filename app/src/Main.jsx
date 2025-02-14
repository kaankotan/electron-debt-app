import React, { Component } from 'react'
import { render } from 'react-dom'
import Lottie from 'react-lottie'
import {} from './styles/global.css'
import 'semantic-ui-css/semantic.min.css'
import * as appConstants from './Constants.jsx'
import * as animationData from './loader_spinner.json'
import * as happyAnimation from './happy.json'
import Link from './components/Link.jsx'
import { remote, Tray } from 'electron'
import moment from 'moment'

import { Button } from 'semantic-ui-react'
import * as FontAwesome from 'react-icons/lib/fa'

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
      debts: [],
      newAddedDebt: null
    }
    this.resize = this.resize.bind(this)
    this.makeDateTurkish = this.makeDateTurkish.bind(this)
    this.handleNewDebt = this.handleNewDebt.bind(this)
    this.handleSignout = this.handleSignout.bind(this)
  }

  handleSignout() {
    this.props.history.replace('/')
    this.setState({ isRequesting: true })
    remote.getCurrentWindow().reload()
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

    var path = require('path')
    /* let myNotification = new Notification('VKU | CENG', {
      body: 'Uygulamaya hoşgeldin!',
      icon: path.join(__dirname, 'electron.png')
    })
    
    myNotification.onclick = () => {
      console.log('Notification clicked')
    } */

    mongoClient.connect(DB_URI, function(err, db) {
      if(err) throw err
      db.db('data').collection('users').find({ 'username': _username })
      .toArray(function(err, results) {
        setTimeout(function() {
          _this.setState({ isRequesting: false })
        }, 2000)
        _this.setState({ debts: results[0].debts })
        console.log(results[0])
        for(let idx = 0; idx < results[0].debts.length; idx++) {
          if(results[0].debts[idx].length !== 0) {
            if(moment(results[0].debts[idx].end, 'MMM DD, YYYY').isBefore(moment(new Date()))) {
              console.log('Late')
              let lateNotification = new Notification('Ödenmemiş Veresiye', {
                body: results[0].debts[idx].name + ' sizden aldığı ' 
                  + results[0].debts[idx].value + 
                  ' TL değerindeki veresiyeyi ödememiş!',
                icon: path.join(__dirname, 'electron.png')
              })
            }
          }
        }
      })
    })
    window.addEventListener('resize', this.resize)
  }

  handleNewDebt(event, arg) {
    var _this = this
    console.log(arg)
    _this.setState({ newAddedDebt: arg })
    var currentDebtArray = _this.state.debts
    currentDebtArray.push(JSON.parse(arg))
    _this.setState({ debts: currentDebtArray })
    setTimeout(function() {
      _this.setState({ newAddedDebt: null })
    }, 5000)
  }

  componentDidMount() {
    var _this = this
    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.on('new-debt-added', this.handleNewDebt)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    ipcRenderer.removeListener('new-debt-added', this.handleNewDebt)
  }

  makeDateTurkish(date) {
    let month = date.split(" ")[0]
    let trMonth = ''
    switch(month) {
      case 'January':
        trMonth = 'Ocak'
        break
      case 'February':
        trMonth = 'Şubat'
        break
      case 'March':
        trMonth = 'Mart'
        break
      case 'April':
        trMonth = 'Nisan'
        break
      case 'May':
        trMonth = 'Mayıs'
        break
      case 'June':
        trMonth = 'Haziran'
        break
      case 'July':
        trMonth = 'Temmuz'
        break
      case 'August':
        trMonth = 'Ağustos'
        break
      case 'September':
        trMonth = 'Eylül'
        break
      case 'October':
        trMonth = 'Ekim'
        break
      case 'November':
        trMonth = 'Kasım'
        break
      case 'December':
        trMonth = 'Aralık'
        break
      default:
        break
    }
    return date.split(" ")[1].replace(",", "") + " " + trMonth + " " + date.split(" ")[2]
  }

  handleDebtAdd = () => {
    const BrowserWindow = remote.BrowserWindow
    let win = new BrowserWindow({ width: 1024, height: 768 })
    win.loadURL(`file://${__dirname}/debt.html`)
  }

  render() {
    const isRequesting = this.state.isRequesting
    var makeDateTurkish = this.makeDateTurkish
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData
    }
    const noDebtOptions = {
      loop: true,
      autoplay: true,
      animationData: happyAnimation
    }
    if(isRequesting) {
      return (
        <Lottie options={defaultOptions}
          height={400}
          width={400}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused} />
      );
    }
    if(!isRequesting && this.state.debts.length === 0 
      && this.state.newAddedDebt === null) {
      return (
        <div>
          <Button color="orange" floated="right" 
            style={{ marginRight: window.innerWidth / 30 }}
            onClick={this.handleDebtAdd}>Yeni Borç Ekle!</Button>
          <Button color="red" floated="left" 
            style={{ marginLeft: window.innerWidth / 30 }}
            onClick={this.handleSignout}>Çıkış Yap!</Button>
          <br /><br /><br />
          <Lottie options={noDebtOptions}
            height={appConstants.animationSize}
            width={appConstants.animationSize} />
          <p style={{ fontSize: appConstants.smallFontSize }}>Veresiye defteriniz boş, kimseden alacağınız yok!</p>
        </div>
      );
    }
    if(!isRequesting && this.state.debts.length !== 0
      && this.state.newAddedDebt === null) {
      return (
        <div>
          <Button color="orange" floated="right" 
            style={{ marginRight: window.innerWidth / 30 }}
            onClick={this.handleDebtAdd}>Yeni Borç Ekle!</Button>
          <Button color="red" floated="left" 
            style={{ marginLeft: window.innerWidth / 30 }}
            onClick={this.handleSignout}>Çıkış Yap!</Button>
          <br /><br /><br />
          <div className="hello">
            <h1>Veresiye listeni sana gösteriyoruz.</h1>
          </div>
          {this.state.debts.map(function(item, i) {
            return (
              <div key={i}>
                <p style={{ fontSize: appConstants.smallFontSize }}>
                  {makeDateTurkish(item.start)} tarihinde verdiğin <FontAwesome.FaCreditCard 
                  style={{ fontSize: '46px', color: 'green' }} /> {item.value} TL tutarındaki veresiyen var! Son ödeme 
                  günü de {makeDateTurkish(item.end)}. </p>
              </div>
            )
          })}
          <br /><br />
        </div>
      );
    }
    if(this.state.newAddedDebt !== null) {
      return (
        <div>
          <div className="hello">
            <h1>Yeni bir borç ekledin!</h1>
          </div>
          <p style={{ fontSize: appConstants.smallFontSize }}>
            {JSON.parse(this.state.newAddedDebt).name + ` kişisine ` + 
            JSON.parse(this.state.newAddedDebt).value + `$ tutarında bir veresiye eklediniz! `}</p>
        </div>
      );
    }

  }
}
