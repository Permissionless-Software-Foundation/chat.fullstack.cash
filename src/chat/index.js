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
      nickname: 'Nicknames',
      peers: [],
      connectedPeer: 'All'
    }

    const ipfsConfig = {
      handleLog: _this.onStatusLog,
      // handleChatLog: _this.onCommandLog
      handleChatLog: _this.incommingChat
    }
    this.ipfsControl = new IpfsControl(ipfsConfig)

    // CT: Should I instantiate the components here? I want to pass the log
    // handler to the IpfsControl library. Maybe we should make the handleLog()
    // function a static function for the component Class?
    // this.statusTerminal = new StatusTerminal()
    // this.commandTerminal = new CommandTerminal()
  }

  render () {
    const { displayTerminal, peers, connectedPeer } = _this.state
    return (
      <Row className='chat-view'>
        <Col xs={12}>
          <StatusBar />
        </Col>
        <Col xs={12} lg={6} className='nodes-container'>
          <Handler handleTerminal={_this.onHandleTerminal} peers={peers} />
        </Col>
        <Col xs={12} lg={6} className='terminals-container'>
          {displayTerminal === 'Chat' && (
            <ChatTerminal
              handleLog={_this.myChat}
              log={_this.state.chatOutput}
              nickname={_this.state.nickname}
              ipfsControl={_this.ipfsControl}
              chatWith={connectedPeer}
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
      // _this.populatePeersWithMock()
    } catch (err) {
      console.error('Error in Chat componentDidMount(): ', err)
      // Do not throw an error. This is a top-level function.
    }
  }

  // Switch between the different terminals.
  onHandleTerminal (object) {
    let { connectedPeer, chatOutput } = _this.state

    // Verify if the selected terminal is a chat
    if (object.peer && object.peer !== connectedPeer) {
      connectedPeer = object.peer
      chatOutput = ''
    }
    _this.setState({
      displayTerminal: object.terminal,
      connectedPeer,
      chatOutput
    })
  }

  // Adds a line to the Status terminal
  onStatusLog (str) {
    try {
      // Update the Status terminal
      _this.setState({
        statusOutput: _this.state.statusOutput + '   ' + str + '\n'
      })

      // If a new peer is found, trigger handleNewPeer()
      if (str.includes('New peer found:')) {
        const ipfsId = str.substring(16)
        _this.handleNewPeer(ipfsId)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  // This function is triggered when a new peer is detected.
  handleNewPeer (ipfsId) {
    try {
      console.log(`IPFS ID: ${ipfsId}`)

      // TODO: Create a 'peer' component (a new button) that displays the peers
      // nickname and a new terminal for that peer, which will be used for e2e
      // encrypted chat.
      const { peers } = _this.state

      peers.push(ipfsId.substring(0, 8))

      _this.setState({
        peers
      })
    } catch (err) {
      console.warn('Error in handleNewPeer(): ', err)
    }
  }

  // Handle chat messages coming in from the IPFS network.
  incommingChat (str) {
    try {
      // console.log(`incommingChat str: ${JSON.stringify(str, null, 2)}`)

      const msg = str.data.data.message
      const handle = str.data.data.handle
      const terminalOut = `${handle}: ${msg}`

      _this.setState({
        chatOutput: _this.state.chatOutput + '   ' + terminalOut + '\n'
      })
    } catch (err) {
      console.warn(err)
      // Don't throw an error as this is a top-level handler.
    }
  }

  // Updates the Chat terminal with chat input from the user.
  myChat (msg, nickname) {
    try {
      const terminalOut = `me: ${msg}`

      _this.setState({
        chatOutput: _this.state.chatOutput + '   ' + terminalOut + '\n',
        nickname
      })
    } catch (err) {
      console.warn('Error in myChat(): ', err)
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

  // Adds several test perrs
  // Function with testing purposes
  // to evaluate the UI behavior
  // with a considerable amount of peers
  populatePeersWithMock () {
    try {
      for (let i = 0; i < 10; i++) {
        _this.handleNewPeer(`peer ${i}`)
      }
    } catch (error) {
      console.warn('Error in populatePeersWithMock(): ', error)
    }
  }
}

export default Chat
