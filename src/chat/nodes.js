import React from 'react'
import { Row, Col, Content, Box, Button } from 'adminlte-2-react'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'

let _this
class Nodes extends React.Component {
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
          <Col xs={12} className="content-box mb-1">
            <h4>Online Nodes:{nodes.length}</h4>
          </Col>
          <Col
            xs={4}
            onClick={() => _this.handleTerminal('ALL')}
            className="content-box mb-1 white-border"
          >
            <h4>ALL</h4>
          </Col>
          <Col
            xs={4}
            onClick={() => _this.handleTerminal('Commands')}
            className="content-box mb-1 white-border"
          >
            <h4>Command</h4>
          </Col>
          <Col
            xs={4}
            onClick={() => _this.handleTerminal('Status')}
            className="content-box mb-1 white-border"
          >
            <h4>Status</h4>
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {}
  handleTerminal (val) {
    console.log(val)
  }
}

export default Nodes
