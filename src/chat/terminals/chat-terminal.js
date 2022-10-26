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
    const { chatWith, peerNames } = _this.props
    return (
      <div>
        <Row>
          <Col xs={12} className='text-center content-box '>
            <span>Chat With : {peerNames[chatWith] || chatWith}</span>
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
        chatOutput: _this.props.log
      })
      _this.keepChatScrolled()
    }
    if (_this.state.nickname !== _this.props.nickname) {
      _this.setState({
        nickname: _this.props.nickname
      })
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
  async handleChatBtn () {
    const msg = _this.state.chatInput
    const nickname = _this.state.nickname

    // Pass the chat message up to the parent component.
    _this.props.handleLog(msg, nickname)

    // Clear in the chat input, to prepare for the next message.
    _this.setState({
      chatInput: ''
    })

    _this.keepChatScrolled()

    // Send a chat message to the chat pubsub room.
    await _this.sendMsgToIpfs()
  }

  // Handles when the Enter key is pressed while in the chat input box.
  async handleChatKeyDown (e) {
    if (e.key === 'Enter') {
      // Display the message on our local chat terminal.
      await _this.handleChatBtn()
    }
  }

  // Send the chat message to the IPFS pubsub room.
  async sendMsgToIpfs () {
    try {
      const connectedPeer = _this.props.chatWith
      const msg = _this.state.chatInput

      const CHAT_ROOM_NAME = 'psf-ipfs-chat-001'

      // Figure out if we're posting to the general chat channel, or a private
      // message to a peer.
      if (connectedPeer !== 'All') {
        console.log(`Sending to ipfs: ${msg} to peer ${connectedPeer}`)

        // // This is a private, p2p message.
        // CHAT_ROOM_NAME = connectedPeer
        //
        // // Get the IPFS peer that we're trying to talk to.
        // const thisPeer =
        //   _this.ipfsControl.ipfsCoord.ipfs.peers.state.peers[connectedPeer]
        //
        // // Send an e2e message to the peer.
        // await _this.ipfsControl.ipfsCoord.ipfs.encrypt.sendEncryptedMsg(
        //   thisPeer,
        //   msg
        // )

        // Send an e2e message to the peer.
        // await ipfsCoord.ipfs.encrypt.sendEncryptedMsg(peers[thisPeer], msg)
        // const peerId = peers[thisPeer].ipfsId
        // await ipfsCoord.ipfs.orbitdb.sendToDb(peerId, msg)

        // Publish an encrypted message to the peers OrbitDB.
        // await _this.ipfsControl.ipfsCoord.ipfs.orbitdb.sendToDb(
        //   connectedPeer,
        //   msg
        // )
        const thisNode = _this.ipfsControl.ipfsCoord.thisNode
        await _this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
          connectedPeer,
          msg,
          thisNode
        )
      } else {
        console.log('Sending to public chat room')

        // This is a chat message for the public chat room.
        const chatObj = {
          message: msg,
          handle: _this.state.nickname
        }

        // console.log(`Sending "${msg}" to ${CHAT_ROOM_NAME}`)
        // console.log('_this.ipfsControl.ipfsCoord: ', _this.ipfsControl.ipfsCoord)

        // Package the message.
        // const chatData = _this.ipfsControl.ipfsCoord.ipfs.schema.chat(chatObj)
        const chatData = _this.ipfsControl.ipfsCoord.thisNode.schema.chat(chatObj)
        const chatDataStr = JSON.stringify(chatData)
        console.log(`chatDataStr: ${chatDataStr}`)

        // Send the message to the IPFS pubsub channel.
        // await _this.ipfsControl.ipfsCoord.ipfs.pubsub.publishToPubsubChannel(
        //   CHAT_ROOM_NAME,
        //   chatDataStr
        // )
        await _this.ipfsControl.ipfsCoord.adapters.pubsub.messaging.publishToPubsubChannel(
          CHAT_ROOM_NAME,
          chatDataStr
        )
      }
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
