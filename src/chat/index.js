import React from 'react'
import { Row, Col } from 'adminlte-2-react'
import Handler from './handler'
import ChatTerminal from './terminals/chat-terminal'
import CommandTerminal from './terminals/command-terminal'
import StatusTerminal from './terminals/status-terminal'

import StatusBar from './status-bar'
import './chat.css'
let _this
class Chat extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      displayTerminal: 'Chat'
    }
  }

  render () {
    const { displayTerminal } = _this.state
    return (
      <Row className='chat-view'>
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

  componentDidMount () {}

  onHandleTerminal (val) {
    _this.setState({
      displayTerminal: val
    })
  }
}

export default Chat
