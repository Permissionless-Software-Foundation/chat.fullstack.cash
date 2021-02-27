import React from 'react'
import { Row, Col } from 'adminlte-2-react'
import PropTypes from 'prop-types'

let _this
class Handler extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      nodes: []
    }
  }

  render () {
    const { nodes } = _this.state
    return (
      <div>
        <Row>
          <Col xs={12} className='content-box mb-1'>
            <h4>Online Nodes:{nodes.length}</h4>
          </Col>
          <Col
            xs={4}
            onClick={() => _this.handleTerminal('Chat')}
            className='content-box mb-1 white-border'
          >
            <h4>ALL</h4>
          </Col>
          <Col
            xs={4}
            onClick={() => _this.handleTerminal('Command')}
            className='content-box mb-1 white-border'
          >
            <h4>Command</h4>
          </Col>
          <Col
            xs={4}
            onClick={() => _this.handleTerminal('Status')}
            className='content-box mb-1 white-border'
          >
            <h4>Status</h4>
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {}
  handleTerminal (val) {
    _this.props.handleTerminal(val)
  }
}
Handler.propTypes = {
  handleTerminal: PropTypes.func
}

export default Handler
