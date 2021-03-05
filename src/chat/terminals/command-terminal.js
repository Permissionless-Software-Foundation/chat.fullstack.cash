import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Inputs } from 'adminlte-2-react'
import CommandRouter from '../lib/commands'
const { Text } = Inputs

let _this // Handle to the instance of this class.

class CommandTerminal extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      commandOutput: "Enter 'help' to see available commands.",
      commandInput: ''
    }

    if (props && props.ipfsControl) {
      this.ipfsControl = props.ipfsControl
      this.commandRouter = new CommandRouter({ ipfsControl: this.ipfsControl })
      // console.log('this.commandRouter: ', this.commandRouter)
    }
  }

  render () {
    const { commandOutput } = _this.state
    return (
      <div>
        <Row>
          <Col xs={12} className='text-center content-box '>
            <h4>Command Terminal</h4>
          </Col>
          <Col xs={12} className='mt-1'>
            <Text
              id='commandTerminal'
              name='commandTerminal'
              inputType='textarea'
              labelPosition='none'
              rows={20}
              readOnly
              value={`${commandOutput ? `${commandOutput}>` : '>'}`}
              onChange={() => {
                /** Prevents DOM error */
              }}
            />
          </Col>
          <Col xs={12}>
            <Text
              id='commandInput'
              name='commandInput'
              inputType='tex'
              labelPosition='none'
              value={this.state.commandInput}
              onChange={this.handleTextInput}
              onKeyDown={_this.handleCommandKeyDown}
            />
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {
    if (_this.state.commandOutput !== _this.props.log) {
      _this.setState({
        commandOutput: _this.props.log
      })
      _this.keepCommandScrolled()
    }
  }

  componentDidUpdate () {
    if (_this.state.commandOutput !== _this.props.log) {
      _this.setState({
        commandOutput: _this.props.log
      })
      _this.keepCommandScrolled()
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

  /* START command handling functions */
  // Handles when the Enter key is pressed while in the chat input box.
  async handleCommandKeyDown (e) {
    if (e.key === 'Enter') {
      // _this.submitMsg()
      // console.log("Enter key");

      // Send a chat message to the chat pubsub room.
      // const now = new Date();
      // const msg = `Message from BROWSER at ${now.toLocaleString()}`
      const msg = _this.state.commandInput
      // console.log(`Sending this message: ${msg}`);

      // _this.handleCommandLog(`me: ${msg}`);

      console.log('_this: ', _this)
      console.log('_this.commandRouter: ', _this.commandRouter)
      const outMsg = await _this.commandRouter.route(msg, _this.ipfsControl)

      if (outMsg === 'clear') {
        _this.props.handleLog('')
      } else {
        _this.handleCommandLog(`\n${outMsg}`)
      }

      // Clear the input text box.
      _this.setState({
        commandInput: ''
      })
    }
  }

  // Adds a line to the terminal
  async handleCommandLog (msg) {
    try {
      // console.log("msg: ", msg);

      _this.props.handleLog(msg)
      // Add a slight delay, to give the browser time to render the DOM.
      await this.sleep(250)

      // _this.keepScrolled();
      _this.keepCommandScrolled()
    } catch (error) {
      console.warn(error)
    }
  }

  // Keeps the terminal scrolled to the last line
  keepCommandScrolled () {
    try {
      // Keeps scrolled to the bottom
      const textarea = document.getElementById('commandTerminal')

      if (textarea) {
        // window.textarea = textarea

        textarea.scrollTop = textarea.scrollHeight
      }
    } catch (error) {
      console.warn(error)
    }
  }
  /* END command handling functions */

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
CommandTerminal.propTypes = {
  handleLog: PropTypes.func,
  log: PropTypes.string
}
export default CommandTerminal
