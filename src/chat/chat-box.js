import React from 'react'
import { Row, Col, Content, Box, Button, Inputs } from 'adminlte-2-react'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'
const { Text, Textarea } = Inputs

let _this
class ChatBox extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      chatMessages: '',
      chatWith: 'All'
    }
  }

  render () {
    const { chatMessages, chatWith } = _this.state
    return (
      <div>
        <Row>
          <Col xs={12} className="text-center content-box ">
            <h4>Chat With : {chatWith}</h4>
          </Col>
          <Col xs={12} className="mt-1">
            <Text
              id="chatMessages"
              name="chatMessages"
              inputType="textarea"
              labelPosition="none"
              rows={20}
              value={chatMessages}
            />
          </Col>
          <Col xs={3}>
            <Text
              id="chatMessages"
              name="chatMessages"
              inputType="tex"
              labelPosition="none"
              placeholder="Nickname"
            />
          </Col>
          <Col xs={9}>
            <Text
              id="chatMessages"
              name="chatMessages"
              inputType="tex"
              labelPosition="none"
              placeholder="type message"
              buttonRight={<Button type="primary" text="Send." />}
            />
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {}
}

export default ChatBox
