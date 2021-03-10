import React from 'react'
import { Row, Col, Button, Inputs } from 'adminlte-2-react'
// import CommandRouter from '../lib/commands'
const { Text } = Inputs

let _this // Instance of this class.

class ChatTerminal extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      chatOutput: '',
      chatInput: '',
      nickname: 'Nickname'
    }

    if (props && props.ipfsControl) {
      this.ipfsControl = props.ipfsControl
    }
  }

  render () {
    const { chatOutput, chatInput } = _this.state
    return (
      <div>
        <Row>
          <Col xs={12} className='text-center content-box '>
            <h4>Chat With : {_this.props.chatWith}</h4>
          </Col>
          <Col xs={12} className='mt-1'>
            <Text
              id='chatTerminal'
              name='chatTerminal'
              inputType='textarea'
              labelPosition='none'
              rows={20}
              value={`${chatOutput ? `${chatOutput}>` : '>'}`}
              readOnly
              onChange={() => {
                /** Prevents DOM error */
              }}
            />
          </Col>
          <Col xs={3}>
            <Text
              id='nickname'
              name='nickname'
              inputType='text'
              labelPosition='none'
              placeholder='Nickname'
              onChange={this.handleNickname}
              value={this.state.nickname}
            />
          </Col>
          <Col xs={9}>
            <Text
              id='chatInput'
              name='chatInput'
              inputType='text'
              labelPosition='none'
              placeholder='type message'
              value={chatInput}
              onChange={this.handleTextInput}
              onKeyDown={_this.handleChatKeyDown}
              buttonRight={
                <Button
                  type='primary'
                  text='Send.'
                  onClick={_this.handleChatBtn}
                />
              }
            />
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {
    // Restore the terminal log after rendering this component.
    if (_this.state.chatOutput !== _this.props.log) {
      _this.setState({
        chatOutput: _this.props.log,
        nickname: _this.props.nickname
      })
      _this.keepChatScrolled()
    }
  }

  // Updates the chat terminal when the parent component recieves a new chat
  // message from the IPFS network.
  componentDidUpdate () {
    if (_this.state.chatOutput !== _this.props.log) {
      _this.setState({
        chatOutput: _this.props.log,
        nickname: _this.props.nickname
      })
      _this.keepChatScrolled()
    }
  }

  // Handles text typed into the input box.
  handleTextInput (event) {
    event.preventDefault()

    const target = event.target
    const value = target.value
    const name = target.name
    // console.log('value: ', value)

    _this.setState({
      [name]: value
    })
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // This handler triggers when the user types a message and hits enter, or
  // clicks the send button.
  handleChatBtn () {
    const msg = _this.state.chatInput
    const nickname = _this.state.nickname

    // Pass the chat message up to the parent component.
    _this.props.handleLog(msg, nickname)

    // Clear in the chat input, to prepare for the next message.
    _this.setState({
      chatInput: ''
    })

    _this.keepChatScrolled()
  }

  // Handles when the Enter key is pressed while in the chat input box.
  async handleChatKeyDown (e) {
    if (e.key === 'Enter') {
      // Display the message on our local chat terminal.
      _this.handleChatBtn()

      // Send a chat message to the chat pubsub room.
      await _this.sendMsgToIpfs()
    }
  }

  // Send the chat message to the IPFS pubsub room.
  async sendMsgToIpfs () {
    try {
      const msg = _this.state.chatInput

      const CHAT_ROOM_NAME = 'psf-ipfs-chat-001'

      const chatObj = {
        message: msg,
        handle: _this.state.nickname
      }

      // console.log(`Sending "${msg}" to ${CHAT_ROOM_NAME}`)

      // Package the message.
      const chatData = _this.ipfsControl.ipfsCoord.ipfs.schema.chat(chatObj)
      const chatDataStr = JSON.stringify(chatData)

      // Send the message to the IPFS pubsub channel.
      await _this.ipfsControl.ipfsCoord.ipfs.pubsub.publishToPubsubChannel(
        CHAT_ROOM_NAME,
        chatDataStr
      )
    } catch (err) {
      console.warn('Error in sendMsgToIpfs()')
      throw err
    }
  }

  // Keeps the terminal scrolled to the last line
  keepChatScrolled () {
    try {
      // Keeps scrolled to the bottom
      const textarea = document.getElementById('chatTerminal')
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight
      }
    } catch (error) {
      console.warn(error)
    }
  }

  handleNickname (event) {
    try {
      event.preventDefault()

      const target = event.target
      const value = target.value
      const name = target.name
      // console.log('value: ', value)

      _this.setState({
        [name]: value
      })
    } catch (err) {
      console.warn('Error in chat-terminal.js/handleNickname(): ', err)
    }
  }
}

export default ChatTerminal
