import React from 'react'
import { Row, Col } from 'adminlte-2-react'
import PropTypes from 'prop-types'

let _this
class Handler extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      currentTerminal: 'All'
    }
  }

  render () {
    const { currentTerminal } = _this.props
    const { peers } = _this.props
    return (
      <div>
        <Row className='chat-nodes'>
          <Col xs={12} className='content-box mb-1'>
            <h4>Online Nodes:{peers.length}</h4>
          </Col>
          <Col
            xs={6}
            onClick={() => _this.handleTerminal('Command')}
            className={`content-box mb-1 white-border ${
              currentTerminal === 'Command' ? 'clicked-btn' : ''
            }`}
          >
            <h4>Command</h4>
          </Col>
          <Col
            xs={6}
            onClick={() => _this.handleTerminal('Status')}
            className={`content-box mb-1 white-border ${
              currentTerminal === 'Status' ? 'clicked-btn' : ''
            }`}
          >
            <h4>Status</h4>
          </Col>

          <Col
            xs={12}
            onClick={() => _this.handlePeer('All')}
            className={`content-box mb-1 white-border ${
              currentTerminal === 'All' ? 'clicked-btn' : ''
            }`}
          >
            <h4>ALL</h4>
          </Col>
          {peers.map(val => {
            return (
              <Col
                key={val}
                xs={12}
                onClick={() => _this.handlePeer(val)}
                className={`content-box mb-1 white-border ${
                  currentTerminal === val ? 'clicked-btn' : ''
                }`}
              >
                <h5>{val}</h5>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }

  componentDidMount () {}

  handlePeer (peer) {
    try {
      /*     _this.setState({
        currentTerminal: peer
      }) */
      _this.props.handleTerminal({ terminal: 'Chat', peer })
    } catch (error) {
      console.warn('Error in handler.js/handlePeer(): ', error)
    }
  }

  handleTerminal (val) {
    try {
      /*       _this.setState({
        currentTerminal: val
      })
      */
      _this.props.handleTerminal({ terminal: val })
    } catch (error) {
      console.warn('Error in handler.js/handleTerminal(): ', error)
    }
  }
}
Handler.propTypes = {
  handleTerminal: PropTypes.func,
  peers: PropTypes.array,
  currentTerminal: PropTypes.string
}

export default Handler
