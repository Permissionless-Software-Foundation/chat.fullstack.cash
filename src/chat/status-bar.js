import React from 'react'
import { Row, Col } from 'adminlte-2-react'

class StatusBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <Row className='text-center'>
        <Col xs={12} lg={4}>
          <p>Node IPFS :</p>
        </Col>
        <Col xs={12} lg={4}>
          <p>IPFS Connection :</p>
        </Col>
        <Col xs={12} lg={4}>
          Chat Status :
        </Col>
      </Row>
    )
  }

  componentDidMount () {}
}

export default StatusBar
