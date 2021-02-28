import React from 'react'
import { Row, Col } from 'adminlte-2-react'
import Handler from './handler'
import ChatTerminal from './terminals/chat-terminal'
import CommandTerminal from './terminals/command-terminal'
import StatusTerminal from './terminals/status-terminal'
import IpfsControl from './lib/ipfs-control'

import StatusBar from './status-bar'
import './chat.css'

// _this is the instance of this class. Used when 'this' loses
// that context.
let _this

class Chat extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      displayTerminal: 'Chat'
    }

    // CT: Should I instantiate the components here? I want to pass the log
    // handler to the IpfsControl library. Maybe we should make the handleLog()
    // function a static function for the component Class?
    this.statusTerminal = new StatusTerminal()
    this.commandTerminal = new CommandTerminal()

    const ipfsConfig = {
      handleLog: _this.statusTerminal.handleLog,
      handleChatLog: _this.commandTerminal.handleCommandLog
    }
    this.ipfsControl = new IpfsControl(ipfsConfig)
  }

  render () {
    const { displayTerminal } = _this.state
    return (
      <Row className="chat-view">
        <Col xs={12}>
          <StatusBar />
        </Col>
        <Col xs={12} lg={6}>
          <Handler handleTerminal={_this.onHandleTerminal} />
        </Col>
        <Col xs={12} lg={6}>
          {displayTerminal === 'Chat' && <ChatTerminal />}
          {displayTerminal === 'Command' && <CommandTerminal />}
          {displayTerminal === 'Status' && <StatusTerminal />}
        </Col>
      </Row>
    )
  }

  async componentDidMount () {
    try {
      await this.ipfsControl.startIpfs()
    } catch (err) {
      console.error('Erro in Chat componentDidMount(): ', err)
      // Do not throw an error. This is a top-level function.
    }
  }

  // Switch between the different terminals.
  onHandleTerminal (val) {
    _this.setState({
      displayTerminal: val
    })
  }

  // This should pipe data to the Status Terminal.
  // handleLog (str) {
  //   try {
  //
  //     _this.statusTerminal.handleLog(str)
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // }

  handleIncomingChatMsg (msg) {
    try {
      console.log(`handleIncomingChatMsg(): ${msg}`)
    } catch (error) {
      console.warn(error)
    }
  }
}

export default Chat
