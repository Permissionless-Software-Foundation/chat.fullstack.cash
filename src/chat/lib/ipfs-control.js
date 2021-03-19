/*
  This library controls the IPFS interface for the app.
*/

/*
  This library contains the logic around the browser-based IPFS full node.
*/

import IPFS from 'ipfs'
import IpfsCoord from 'ipfs-coord'

// CHANGE THESE VARIABLES
const CHAT_ROOM_NAME = 'psf-ipfs-chat-001'

let _this

class IpfsControl {
  constructor (ipfsConfig) {
    this.statusLog = ipfsConfig.statusLog
    this.handleChatLog = ipfsConfig.handleChatLog
    this.wallet = ipfsConfig.bchWallet

    _this = this
  }

  // Top level function for controlling the IPFS node. This funciton is called
  // by the componentDidMount() function of the page.
  async startIpfs () {
    try {
      console.log('Setting up instance of IPFS...')
      this.statusLog('Setting up instance  of IPFS...')

      this.ipfs = await IPFS.create()
      this.statusLog('IPFS node created.')

      // Generate a new wallet.
      // this.wallet = new BchWallet()
      // console.log("this.wallet: ", this.wallet);

      if (!this.wallet) {
        throw new Error('Wallet Not Found.! . Create or import a wallet')
      }
      // Wait for the wallet to initialize.
      await this.wallet.walletInfoPromise

      // Instantiate the IPFS Coordination library.
      this.ipfsCoord = new IpfsCoord({
        ipfs: this.ipfs,
        type: 'browser',
        statusLog: this.statusLog, // Status log
        bchjs: this.wallet.bchjs,
        mnemonic: this.wallet.walletInfo.mnemonic
      })
      this.statusLog('ipfs-coord library instantiated.')

      // Wait for the coordination stuff to be setup.
      await this.ipfsCoord.isReady()

      // subscribe to the 'chat' chatroom.
      await this.ipfsCoord.ipfs.pubsub.subscribeToPubsubChannel(
        CHAT_ROOM_NAME,
        this.handleChatLog
      )

      // Pass the IPFS instance to the window object. Makes it easy to debug IPFS
      // issues in the browser console.
      if (typeof window !== 'undefined') window.ipfs = this.ipfs

      // Get this nodes IPFS ID
      const id = await this.ipfs.id()
      this.ipfsId = id.id
      this.statusLog(`This IPFS node ID: ${this.ipfsId}`)

      console.log('IPFS node setup complete.')
      this.statusLog('IPFS node setup complete.')
      _this.statusLog(' ')
    } catch (err) {
      console.error('Error in startIpfs(): ', err)
      this.statusLog('Error trying to initialize IPFS node!')
    }
  }

  // This funciton handles incoming chat messages.
  handleChatMsg (msg) {
    try {
      console.log('msg: ', msg)
    } catch (err) {
      console.error('Error in handleChatMsg(): ', err)
    }
  }
}

// module.exports = AppIpfs
export default IpfsControl
