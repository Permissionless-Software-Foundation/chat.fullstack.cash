import React from 'react'
import { Row, Col, Inputs } from 'adminlte-2-react'
import CommandRouter from '../lib/commands'
const { Text } = Inputs

let _this
class StatusTerminal extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      output: ''
    }
    this.commandRouter = new CommandRouter()
  }

  render () {
    const { output } = _this.state
    return (
      <div>
        <Row>
          <Col xs={12} className='text-center content-box '>
            <h4>IPFS STATUS </h4>
          </Col>
          <Col xs={12} className='mt-1'>
            <Text
              id='ipfsTerminal'
              name='ipfsTerminal'
              inputType='textarea'
              labelPosition='none'
              rows={20}
              readOnly
              value={`${output ? `${output}>` : '>'}`}
            />
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {}

  // Adds a line to the terminal
  handleLog (str) {
    try {
      _this.setState({
        output: _this.state.output + '   ' + str + '\n'
      })
      _this.keepScrolled()
    } catch (error) {
      console.warn(error)
    }
  }

  // Keeps the terminal scrolled to the last line
  keepScrolled () {
    try {
      // Keeps scrolled to the bottom
      const textarea = document.getElementById('ipfsTerminal')
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight
      }
    } catch (error) {
      console.warn(error)
    }
  }
}

export default StatusTerminal
