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
      displayTerminal: 'Chat',
      statusOutput: '',
      commandOutput: "Enter 'help' to see available commands.",
      chatOutput: '',
      nickname: 'Nicknames'
    }

    const ipfsConfig = {
      handleLog: _this.onStatusLog,
      // handleChatLog: _this.onCommandLog
      handleChatLog: _this.onChatLog
    }
    this.ipfsControl = new IpfsControl(ipfsConfig)

    // CT: Should I instantiate the components here? I want to pass the log
    // handler to the IpfsControl library. Maybe we should make the handleLog()
    // function a static function for the component Class?
    // this.statusTerminal = new StatusTerminal()
    // this.commandTerminal = new CommandTerminal()
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
          {displayTerminal === 'Chat' && (
            <ChatTerminal
              handleLog={_this.onChatLog}
              log={_this.state.chatOutput}
              nickname={_this.state.nickname}
              ipfsControl={_this.ipfsControl}
            />
          )}
          {displayTerminal === 'Command' && (
            <CommandTerminal
              handleLog={_this.onCommandLog}
              log={_this.state.commandOutput}
              ipfsControl={_this.ipfsControl}
            />
          )}
          {displayTerminal === 'Status' && (
            <StatusTerminal
              handleLog={_this.onStatusLog}
              log={_this.state.statusOutput}
            />
          )}
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

  // Adds a line to the ipfs Status terminal
  onStatusLog (str) {
    try {
      _this.setState({
        statusOutput: _this.state.statusOutput + '   ' + str + '\n'
      })
    } catch (error) {
      console.warn(error)
    }
  }

  // Adds a line to the Chat terminal
  onChatLog (str, nickname) {
    try {
      console.log(`onChatLog str: ${JSON.stringify(str, null, 2)}`)

      console.log(`typeof str: ${typeof str}`)

      let terminalOut = ''
      if (typeof str === 'string') {
        terminalOut = str
      } else {
        const msg = str.data.data.message
        const handle = str.data.data.handle
        terminalOut = `${handle}: ${msg}`
      }
      console.log(`terminalOut: ${terminalOut}`)

      _this.setState({
        chatOutput: _this.state.chatOutput + '   ' + terminalOut + '\n',
        nickname
      })
    } catch (error) {
      console.warn(error)
    }
  }

  // Adds a line to the Command terminal
  onCommandLog (msg) {
    try {
      let commandOutput
      if (!msg) {
        commandOutput = ''
      } else {
        commandOutput = _this.state.commandOutput + '   ' + msg + '\n'
      }
      _this.setState({
        commandOutput
      })
    } catch (error) {
      console.warn(error)
    }
  }
}

export default Chat
