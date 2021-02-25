import React from 'react'
import { Row, Col, Content, Box, Button } from 'adminlte-2-react'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'

let _this
class StatusBar extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {}
  }

  render () {
    return (
      <div className="text-center">
        <h2> Chat Status</h2>
      </div>
    )
  }

  componentDidMount () {}
}

export default StatusBar
