import React from 'react'
import { Row, Col, Content, Box, Button } from 'adminlte-2-react'
import Nodes from './nodes'
import ChatBox from './chat-box'
import StatusBar from './status-bar'
import './chat.css'
let _this
class Chat extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {}
  }

  render () {
    return (
      <Row className="chat-view">
        <Col xs={12}>
          <StatusBar />
        </Col>
        <Col xs={12} lg={6}>
          <Nodes />
        </Col>
        <Col xs={12} lg={6}>
          <ChatBox />
        </Col>
      </Row>
    )
  }

  componentDidMount () {}
}

export default Chat
