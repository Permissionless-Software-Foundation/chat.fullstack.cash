import React from 'react'
import { Row, Col } from 'adminlte-2-react'

class StatusBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const { info } = this.props
    const { ipfsId, announceJsonLd } = info

    return (
      <Row className='text-center status-bar'>
        <Col className='status-content' xs={12} lg={6}>
          <span className='status-title'>Node IPFS : </span>
          <b>{ipfsId ? info.ipfsId : ''}</b>
        </Col>
        <Col className='status-content' xs={12} lg={3}>
          <span className='status-title'>IPFS Connection : </span>
          <b>{announceJsonLd ? info.announceJsonLd.name : ''}</b>
        </Col>
        <Col className='status-content' xs={12} lg={3}>
          Chat Status :
        </Col>
      </Row>
    )
  }

  componentDidMount () {}
}

export default StatusBar
